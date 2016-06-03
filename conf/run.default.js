var config = {};

config.app_id = 'test-football-app-2016';
config.app_name = 'Test-Football-App-2016';
config.version = '0.0.1';

config.host = process.env.HOST || 'localhost';
config.port = process.env.PORT || 8080;

config.master_key = process.env.MASTER_KEY || 'defaultMasterKey';
config.import_key = process.env.IMPORT_KEY || 'defaultAPIKeyForImportData';
config.file_key_o = process.env.FILE_KEY_O || 'defaultFileKey';

config.db_uri = process.env.DATABASE_URI || 'mongodb://localhost:27017/football';

module.exports = config;