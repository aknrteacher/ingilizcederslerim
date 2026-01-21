import { useEffect } from 'react';

/**
 * Component that adds noindex, nofollow meta tag to prevent search engine indexing.
 * Use this on admin pages or any page you don't want indexed.
 */
export function NoIndex() {
  useEffect(() => {
    // Check if meta tag already exists
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
    const originalContent = meta?.content;
    
    if (meta) {
      // Update existing meta tag
      meta.content = 'noindex, nofollow';
    } else {
      // Create new meta tag
      meta = document.createElement('meta');
      meta.name = 'robots';
      meta.content = 'noindex, nofollow';
      document.head.appendChild(meta);
    }

    return () => {
      // Restore original content or remove the tag
      if (originalContent !== undefined) {
        meta.content = originalContent;
      } else if (meta.parentNode) {
        meta.parentNode.removeChild(meta);
      }
    };
  }, []);

  return null;
}
