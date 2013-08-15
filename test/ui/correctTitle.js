module.exports = {
'Page title is correct': function (test) {
  test
    .open('http://134.76.21.92:8080/archaeo18/')
    .assert.title().is('ARCHAEO 18', 'It has title')
    .done();
}
};
