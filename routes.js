var quiz = require('./models/quiz');

module.exports = {
  configure: function(app) {
    app.get('/gen/', function(req, res) {
      quiz.getAll(res);
    });
	
	app.get('/gen/:id/', function(req, res) {
      quiz.getById(req.params.id,res);
    });

    app.post('/gen/', function(req, res) {
      quiz.add(req.body, res);
    });

    app.put('/gen/', function(req, res) {
      quiz.update(req.body, res);
    });

    app.delete('/gen/:id/', function(req, res) {
      quiz.delete(req.params.id, res);
    });
  }
};