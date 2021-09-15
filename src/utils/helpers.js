/**
 * 
 * @param {Object} source 
 * @param {Object} destination 
 * @returns {Object}
 */

const helpers = {
  updateMatchingProperties: (source, destination) => {
    Object.keys(source).forEach(key => {
      if (key in destination) {
        destination[key] = source[key];
      }
    });

    return destination;
  },

  currentDate: () => {
    return new Date();
  },

  alert: (type, msg) => {
    return (
      <div className={`alert alert-${type}`} style={{ whiteSpace: 'pre-wrap' }} role="alert">
        {msg}
      </div>
    );
  },

  arrayToHtmlList: (array) => {
    return (array
      .map((val, i) => <li key={i}>{val}</li>))
  }
}

export default helpers;