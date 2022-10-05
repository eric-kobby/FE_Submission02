var formatHelper = (function() {

  function FormatHelper (){}

  /**
   * Converts regular number into a compact number
   * @param {number} num 
   *
   */
  FormatHelper.prototype.convertToCompactNumber = function(num){
    return Intl.NumberFormat('en-US', { 
      notation: 'compact', 
      style: 'currency',
      currency: 'USD' }).format(num);
  }
  return new FormatHelper();
})();