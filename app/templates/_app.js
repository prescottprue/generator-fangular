angular.module('<%= appName %>', ['ui.router','ngMaterial', 'firebase'])
.config(function($stateProvider, $urlRouterProvider, $mdThemingProvider, $locationProvider){
  $stateProvider
  .state('navbar', {
    templateUrl: 'templates/navbar.html',
    abstract:true
  })
  .state('home', {
    parent:'navbar',
    url: '/',
    templateUrl: 'components/home/home-index.html',
    controller:'HomeCtrl'
  })
  $urlRouterProvider.otherwise("/");
  $mdThemingProvider.theme('default')
     .primaryPalette('blue')
     .accentPalette('pink');
})
/** Search a list for an item with a "name" parameter patching a query
 * @params {Array} items - Items within which to search for matching names
 * @params {String} query - Query to search list for matching names with
 * @returns {Array} filtered list
 */
.filter('searchName', function($window){
  return function (items, query) {
    var filtered = [];
    var letterMatch = new RegExp(query, 'i');
    var filtered = $window._.filter(items, function(item){
      if (letterMatch.test(item.name.substring(0, query.length))) {
          return true;
      }
      return false;
    })
    return filtered;
  };
})
/** Search a list for an item with a "tags" parameter patching a query
 * @params {Array} items - Items list within which to search "tags" parameters.
 * @params {String} query - Query to search list for matching tags with
 * @returns {Array} filtered list
 */
.filter('searchTags', function($window){
  /** Check item parameters for a given tag
   * @params {Object} item Item to search tags of
   * @params {String} tagsStr tags seperated by ", "
   * @returns {Boolean} whether or not the item contains a tag
   */
  function checkItemForTag(item, tagStr) {
    if(tagStr == "" || tagStr == " ") return true;
    var letterMatch = new RegExp(tagStr, 'i');
    if(_.has(item, "tags") && _.isArray(item.tags)) {
      // _.some finds if item contains tag
      var containsTag = _.some(item.tags, function(tag){
        return letterMatch.test(tag.substring(0, tagStr.length));
      });
      return containsTag;
    }
    return false;
  }

  return function (items, query) {
    if(query && _.isString(query)){
      var tagsArray = query.split(",");
      return _.filter(items, function(item){
        if(tagsArray.length > 1) {
          //multiple tags
          //_.some would show projects that contain any of the tags
          return _.every(tagsArray, function(tag){
            return checkItemForTag(item, tag);
          });
        }
        //Single tag
        return checkItemForTag(item, query);
      });
    }
    //Query is null
    return items;
  };
})
