"""
Cache Service
Handles Redis caching for expensive operations like PlayStore scraping and processing
"""

import json
import hashlib
from typing import Optional, Tuple
from io import BytesIO
import redis
from app.schemas.models import ProcessingResponse
from app.core.logger import get_logger

logger = get_logger(__name__)


class CacheService:
    """
    Service for caching ProcessingResponse and PDF results using Redis

    Cache strategies:
    - PlayStore URL: SHA256 hash of URL
    - CSV file: SHA256 hash of file content
    - Single comment: SHA256 hash of comment text
    - Value: JSON with ProcessingResponse + base64 PDF
    - TTL: 7 days (604800 seconds)
    """

    # Cache TTL: 7 days
    CACHE_TTL_SECONDS = 7 * 24 * 60 * 60  # 604800 seconds

    def __init__(self):
        """Initialize Redis cache service"""
        self.redis_client: Optional[redis.Redis] = None
        self.enabled = False

        try:
            # Connect to local Redis
            self.redis_client = redis.Redis(
                host='localhost',
                port=6379,
                db=0,
                decode_responses=False,  # We'll handle encoding ourselves
                socket_connect_timeout=5,
                socket_timeout=5
            )

            # Test connection
            self.redis_client.ping()
            self.enabled = True
            logger.info("✓ Redis cache service initialized successfully")

        except redis.ConnectionError as e:
            logger.warning(f"⚠ Redis connection failed: {e}. Cache disabled.")
            self.enabled = False
        except Exception as e:
            logger.warning(f"⚠ Redis initialization failed: {e}. Cache disabled.")
            self.enabled = False

    def _generate_cache_key(self, content: str, prefix: str = "playstore") -> str:
        """
        Generate a cache key from content

        Args:
            content: Content to hash (URL, comment text, CSV content, etc.)
            prefix: Cache key prefix (playstore, csv, comment)

        Returns:
            Cache key (SHA256 hash)
        """
        # Normalize content (lowercase, strip whitespace)
        normalized_content = content.lower().strip()

        # Generate SHA256 hash
        hash_object = hashlib.sha256(normalized_content.encode())
        cache_key = f"{prefix}:{hash_object.hexdigest()}"

        return cache_key

    def _get_cached_result_generic(
        self,
        content: str,
        prefix: str,
        description: str
    ) -> Optional[Tuple[ProcessingResponse, BytesIO]]:
        """
        Generic method to get cached result

        Args:
            content: Content to hash
            prefix: Cache key prefix
            description: Description for logging (e.g., "URL", "comment", "CSV")

        Returns:
            Tuple of (ProcessingResponse, PDF BytesIO) if cached, None otherwise
        """
        if not self.enabled:
            return None

        try:
            cache_key = self._generate_cache_key(content, prefix)

            # Get from Redis
            cached_data = self.redis_client.get(cache_key)

            if cached_data is None:
                logger.info(f"Cache MISS for {description}: {content[:50]}...")
                return None

            # Deserialize
            data = json.loads(cached_data)

            # Reconstruct ProcessingResponse
            response = ProcessingResponse(**data['response'])

            # Reconstruct PDF BytesIO from base64
            import base64
            pdf_bytes = base64.b64decode(data['pdf_base64'])
            pdf_buffer = BytesIO(pdf_bytes)

            logger.info(f"✓ Cache HIT for {description}: {content[:50]}... (saved processing time)")

            return response, pdf_buffer

        except Exception as e:
            logger.error(f"Error retrieving from cache: {e}")
            return None

    def get_cached_result(
        self,
        url: str
    ) -> Optional[Tuple[ProcessingResponse, BytesIO]]:
        """
        Get cached result for a PlayStore URL

        Args:
            url: PlayStore URL

        Returns:
            Tuple of (ProcessingResponse, PDF BytesIO) if cached, None otherwise
        """
        return self._get_cached_result_generic(url, "playstore", "PlayStore URL")

    def _cache_result_generic(
        self,
        content: str,
        prefix: str,
        description: str,
        response: ProcessingResponse,
        pdf_buffer: BytesIO
    ) -> bool:
        """
        Generic method to cache result

        Args:
            content: Content to hash
            prefix: Cache key prefix
            description: Description for logging
            response: ProcessingResponse object
            pdf_buffer: PDF BytesIO buffer

        Returns:
            True if cached successfully, False otherwise
        """
        if not self.enabled:
            return False

        try:
            cache_key = self._generate_cache_key(content, prefix)

            # Serialize PDF to base64
            import base64
            pdf_buffer.seek(0)  # Reset buffer position
            pdf_base64 = base64.b64encode(pdf_buffer.read()).decode('utf-8')

            # Prepare data for caching
            cache_data = {
                'response': response.model_dump(),  # Pydantic v2
                'pdf_base64': pdf_base64
            }

            # Serialize to JSON
            serialized_data = json.dumps(cache_data)

            # Store in Redis with TTL
            self.redis_client.setex(
                cache_key,
                self.CACHE_TTL_SECONDS,
                serialized_data
            )

            logger.info(f"✓ Cached result for {description}: {content[:50]}... (TTL: 7 days)")

            return True

        except Exception as e:
            logger.error(f"Error caching result: {e}")
            return False

    def cache_result(
        self,
        url: str,
        response: ProcessingResponse,
        pdf_buffer: BytesIO
    ) -> bool:
        """
        Cache result for a PlayStore URL

        Args:
            url: PlayStore URL
            response: ProcessingResponse object
            pdf_buffer: PDF BytesIO buffer

        Returns:
            True if cached successfully, False otherwise
        """
        return self._cache_result_generic(url, "playstore", "PlayStore URL", response, pdf_buffer)

    def invalidate_cache(self, url: str) -> bool:
        """
        Invalidate cache for a specific URL

        Args:
            url: PlayStore URL

        Returns:
            True if invalidated, False otherwise
        """
        if not self.enabled:
            return False

        try:
            cache_key = self._generate_cache_key(url)
            deleted = self.redis_client.delete(cache_key)

            if deleted:
                logger.info(f"✓ Cache invalidated for URL: {url[:50]}...")
                return True
            else:
                logger.info(f"No cache found to invalidate for URL: {url[:50]}...")
                return False

        except Exception as e:
            logger.error(f"Error invalidating cache: {e}")
            return False

    def clear_all_cache(self) -> bool:
        """
        Clear all PlayStore cache entries

        Returns:
            True if cleared, False otherwise
        """
        if not self.enabled:
            return False

        try:
            # Find all playstore cache keys
            keys = self.redis_client.keys("playstore:*")

            if keys:
                deleted = self.redis_client.delete(*keys)
                logger.info(f"✓ Cleared {deleted} cache entries")
                return True
            else:
                logger.info("No cache entries to clear")
                return False

        except Exception as e:
            logger.error(f"Error clearing cache: {e}")
            return False

    # ========== CSV Cache Methods ==========

    def get_cached_csv_result(
        self,
        csv_content: str
    ) -> Optional[Tuple[ProcessingResponse, BytesIO]]:
        """
        Get cached result for CSV file content

        Args:
            csv_content: Content of the CSV file

        Returns:
            Tuple of (ProcessingResponse, PDF BytesIO) if cached, None otherwise
        """
        return self._get_cached_result_generic(csv_content, "csv", "CSV file")

    def cache_csv_result(
        self,
        csv_content: str,
        response: ProcessingResponse,
        pdf_buffer: BytesIO
    ) -> bool:
        """
        Cache result for CSV file content

        Args:
            csv_content: Content of the CSV file
            response: ProcessingResponse object
            pdf_buffer: PDF BytesIO buffer

        Returns:
            True if cached successfully, False otherwise
        """
        return self._cache_result_generic(csv_content, "csv", "CSV file", response, pdf_buffer)

    # ========== Single Comment Cache Methods ==========

    def get_cached_comment_result(
        self,
        comment: str
    ) -> Optional[Tuple[ProcessingResponse, BytesIO]]:
        """
        Get cached result for single comment

        Args:
            comment: Comment text

        Returns:
            Tuple of (ProcessingResponse, PDF BytesIO) if cached, None otherwise
        """
        return self._get_cached_result_generic(comment, "comment", "single comment")

    def cache_comment_result(
        self,
        comment: str,
        response: ProcessingResponse,
        pdf_buffer: BytesIO
    ) -> bool:
        """
        Cache result for single comment

        Args:
            comment: Comment text
            response: ProcessingResponse object
            pdf_buffer: PDF BytesIO buffer

        Returns:
            True if cached successfully, False otherwise
        """
        return self._cache_result_generic(comment, "comment", "single comment", response, pdf_buffer)

    # ========== Cache Management Methods ==========

    def get_cache_stats(self) -> dict:
        """
        Get cache statistics

        Returns:
            Dictionary with cache stats
        """
        if not self.enabled:
            return {
                "enabled": False,
                "total_keys": 0,
                "memory_used": "0 MB"
            }

        try:
            keys = self.redis_client.keys("playstore:*")
            info = self.redis_client.info("memory")

            return {
                "enabled": True,
                "total_keys": len(keys),
                "memory_used_bytes": info.get("used_memory", 0),
                "memory_used": f"{info.get('used_memory', 0) / (1024 * 1024):.2f} MB"
            }

        except Exception as e:
            logger.error(f"Error getting cache stats: {e}")
            return {
                "enabled": True,
                "error": str(e)
            }


# Global service instance
cache_service = CacheService()
