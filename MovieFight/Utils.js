const debounce = (cb, delay = 600) => {
   let timeoutID;
   return (...args) => {
      if (timeoutID) {
         clearTimeout(timeoutID);
      }
      timeoutID = setTimeout(() => {
         cb.apply(null, args);
      }, delay);
   };
};
