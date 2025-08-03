import { useEffect } from 'react';

const BackgroundAnimation = ({ containerId }) => {
  useEffect(() => {
    const container = containerId ? document.getElementById(containerId) : document.body;
    if (container && !document.getElementById('dynamic-background')) {
      const bgDiv = document.createElement('div');
      bgDiv.id = 'dynamic-background';
      container.prepend(bgDiv);
    }

    return () => {
      const dynamicBackground = document.getElementById('dynamic-background');
      if (dynamicBackground) {
        dynamicBackground.parentNode.removeChild(dynamicBackground);
      }
    };
  }, [containerId]);

  return null;
};

export default BackgroundAnimation;
