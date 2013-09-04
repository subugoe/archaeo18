module.exports = {
'Manuscripts title is correct': function (test) {
  test
    .open('http://134.76.21.92:8080/archaeo18/')
    .click('#linkhandschriften')
    .assert.title().is('Archaeo 18: Handschriften', 'It has title')
    .screenshot('screenshots/Manuscripts.png')
    .done();
}
};
