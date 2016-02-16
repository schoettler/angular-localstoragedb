'use strict';

describe('angular-localstorageDB', function() {
  var _localstoragedb;
  var provider;

//  beforeEach(angular.mock.module('test'));

  beforeEach(module('localstoragedb', function( LocalStorageDBProvider ) {
      provider = LocalStorageDBProvider;
  }));

  beforeEach(inject(function($injector) {

    _localstoragedb = $injector.get('LocalStorageDB');
    createTestTable();
  }));

  describe('Create database', function() {
    var db_name = 'test';
    var db_version = '1.0.0';

    it('Should create a test database', function() {
      provider.setDefaultDatabase(db_name, db_version);

      expect(provider.getDefaultDatabase()).toEqual(db_name);
    });
  });

  describe('CRUD operations', function() {
    var now = new Date().getTime() / 1000;


    it('Should insert a row in the test database', function() {
    	var insertRow = {code: '0001', title: 'test title', author: 'test author', year: now, copies: 999};

    	// insert the row
    	_localstoragedb.insert('test_table', insertRow);
      _localstoragedb.commit();

    	var queryResult = _localstoragedb.queryAll('test_table', {query: { year: now } });

    	// should query one row
    	expect(queryResult.length).toBeGreaterThan(0);

    	// should attr match
    	expect(queryResult[0].hasOwnProperty('code')).toBeTruthy();
      expect(queryResult[0].code).toEqual(insertRow.code);
      expect(queryResult[0].hasOwnProperty('author')).toBeTruthy();
      expect(queryResult[0].author).toEqual(insertRow.author);
      expect(queryResult[0].hasOwnProperty('year')).toBeTruthy();
      expect(queryResult[0].year).toEqual(insertRow.year);
      expect(queryResult[0].hasOwnProperty('copies')).toBeTruthy();
      expect(queryResult[0].copies).toEqual(insertRow.copies);

    });

    it('Should update a row in test database', function() {
    	// update the insert row
    	// change the title to 'Unknown'
    	_localstoragedb.update('test_table', {code: 'B001'}, function(row) {
    	    row.title = 'Unknown';
    	    return row;
    	});

    	var queryResult = _localstoragedb.queryAll('test_table', {query: { code: 'B001' } });

    	// should title change to Unknown
      expect(queryResult[0].hasOwnProperty('title')).toBeTruthy();
      expect(queryResult[0].title).toEqual('Unknown');
    });

    it('Should delete a row in the test database', function() {
    	_localstoragedb.deleteRows('test_table', {code: 'B001'});
    	_localstoragedb.commit();

    	var queryResult = _localstoragedb.queryAll('test_table', {query: { code: 'B001' } });

    	// should no row return
    	expect(queryResult.length).toEqual(0);
    });
  });
  function createTestTable() {

  	if (_localstoragedb.tableExists('test_table')) _localstoragedb.dropTable('test_table');
  	_localstoragedb.commit();

      // create the 'books' table
      _localstoragedb.createTable('test_table', ['code', 'title', 'author', 'year', 'copies']);

      // insert some data
      _localstoragedb.insert('test_table', {code: 'B001', title: 'Phantoms in the brain', author: 'Ramachandran', year: 1999, copies: 10});
      _localstoragedb.insert('test_table', {code: 'B002', title: 'The tell-tale brain', author: 'Ramachandran', year: 2011, copies: 10});
      _localstoragedb.insert('test_table', {code: 'B003', title: 'Freakonomics', author: 'Levitt and Dubner', year: 2005, copies: 10});
      _localstoragedb.insert('test_table', {code: 'B004', title: 'Predictably irrational', author: 'Ariely', year: 2008, copies: 10});
      _localstoragedb.insert('test_table', {code: 'B005', title: 'Tesla: Man out of time', author: 'Cheney', year: 2001, copies: 10});
      _localstoragedb.insert('test_table', {code: 'B006', title: 'Salmon fishing in the Yemen', author: 'Torday', year: 2007, copies: 10});
      _localstoragedb.insert('test_table', {code: 'B007', title: 'The user illusion', author: 'Norretranders', year: 1999, copies: 10});
      _localstoragedb.insert('test_table', {code: 'B008', title: 'Hubble: Window of the universe', author: 'Sparrow', year: 2010, copies: 10});

      _localstoragedb.commit();
    }
});
