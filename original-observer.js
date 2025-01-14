// Original 2019

const observePartial = () => {
  const config = {
    attributes: true,
    childList: true,
    characterData: true
  };
  let promiseResolve;
  let mutationObserver;
  let observerCallback;
  let observerElement;
  let once = true;
  
  // Actions on every observation
  const recorder = (mutationsList, observer) => {
    const params = {
      mutationsList,
      observer,
      element: observerElement
    };
    const resolve = (resolveParams) => {
      promiseResolve(resolveParams);
      // Disconnect once resolved.
      mutationObserver.disconnect();
    }

    if (typeof observerCallback === 'function') {
      observerCallback(resolve, params);
    } else {
      resolve(params);
    }
  }
 
  /**
   * Observe
   */
  return (element, callback) => {
    const isElement = element instanceof Element;

    if (!isElement) {
      console.error(`observe: ${element} is not an element`)
    }

    // The mutation observer created once.
    return new Promise(function(resolve, promiseReject) {
      if (once) {
        once = false;
        mutationObserver = new MutationObserver(recorder);
      }
      observerCallback = callback;
      promiseResolve = resolve;
      observerElement = element;
      mutationObserver.observe(element, config);
    });
  }
}

const observe = observePartial();
