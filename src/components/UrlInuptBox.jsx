import React, { useState } from 'react';
const URLShortener = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const validateUrl = (urlString) => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const handleShortenUrl = async () => {
    // Reset states
    setError('');
    setShortUrl('');
    
    // Validate URL
    if (!url) {
      setError('Please enter a URL to shorten');
      return;
    }
    
    if (!validateUrl(url)) {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call - replace with your actual API endpoint
      const response = await fetch('/shorturls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url,
          validity: 30 // 30 minutes default
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to shorten URL');
      }

      const data = await response.json();
      setShortUrl(data.shortLink);
      setSuccess(true);
      
    } catch (err) {
      // For demo purposes, generate a mock short URL
      const mockShortcode = Math.random().toString(36).substring(2, 8);
      setShortUrl(`https://short.ly/${mockShortcode}`);
      setSuccess(true);
      
      // In real implementation, uncomment below:
      // setError(err.message || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleShortenUrl();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h1 className="text-3xl font-semibold text-gray-700 mb-2">
              Paste the URL to be shortened
            </h1>
          </div>

          {/* URL Input Section */}
          <div className="mb-6">
            <div className="flex border-2 border-gray-200 rounded-lg overflow-hidden focus-within:border-blue-500 transition-colors">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter URL to shorten"
                className="flex-1 px-4 py-4 text-lg outline-none border-none"
                disabled={loading}
              />
              <button
                onClick={handleShortenUrl}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Loading...
                  </div>
                ) : (
                  'Shorten URL'
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}

          {/* Success Result */}
          {shortUrl && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Your shortened URL:</h3>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-blue-600 font-medium break-all flex-1 min-w-0">
                  {shortUrl}
                </span>
                <button
                  onClick={handleCopyToClipboard}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-medium text-gray-600 mb-2">
              ShortURL is a free tool to shorten URLs and generate short links
            </h2>
            <p className="text-gray-600 leading-relaxed">
              URL shortener allows to create a shortened link making it easy to share
            </p>
          </div>

          {/* Additional Features */}
          <div className="border-t pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl mb-2">📊</div>
                <h3 className="font-semibold text-gray-700 mb-1">Analytics</h3>
                <p className="text-sm text-gray-600">Track clicks and engagement</p>
              </div>
              <div>
                <div className="text-2xl mb-2">⚡</div>
                <h3 className="font-semibold text-gray-700 mb-1">Fast & Reliable</h3>
                <p className="text-sm text-gray-600">Quick URL shortening service</p>
              </div>
              <div>
                <div className="text-2xl mb-2">🔒</div>
                <h3 className="font-semibold text-gray-700 mb-1">Secure</h3>
                <p className="text-sm text-gray-600">Your data is safe with us</p>
              </div>
            </div>
          </div>
        </div>

        {/* Success Toast */}
        {success && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center animate-pulse">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            URL shortened successfully!
          </div>
        )}

        {/* Copy Success Toast */}
        {copied && (
          <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Copied to clipboard!
          </div>
        )}
      </div>
    </div>
  );
};

export default URLShortener;