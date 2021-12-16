var cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'awdawd',
    api_key: '435351667855833',
    api_secret: '15Gcbu89_cF4yThajLQLJyk6caE',
    secure: true
});
module.exports = { cloudinary }