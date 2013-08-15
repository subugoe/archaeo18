module.exports = {
'Edition title is correct': function (test) {
  test
    .open('http://134.76.21.92:8080/archaeo18/')
    .click('#linkedition')
    .assert.title().is('Archaeo 18: Edition', 'It has title')
    .screenshot('screenshots/edition.png')
    .done();
}
};
