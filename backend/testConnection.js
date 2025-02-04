const db = require('./models/index'); 

async function testConnection() {
  try {
    await db.sequelize.authenticate(); 
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
  } finally {
    await db.sequelize.close();
  }
}

testConnection();
