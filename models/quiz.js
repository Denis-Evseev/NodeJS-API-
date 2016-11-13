var connection = require('../connection');
var answer = require('../models/answer');
var question = require('../models/question');

function Quiz() {
  this.getAll = function(res) {
    connection.acquire(function(err, con) {
      con.query('select * from quizes', function(err, result) {
        con.release();
        res.send(result);
      });
    });
  };
  
  this.getById = function(quizId,res) {
	connection.acquire(function(err, con) {
	  con.query('select * from quizes where `id` = ? ', quizId, function(err, result) {
		con.release();
		//TODO 
		question.getAllByQuizId(quizId, function(err, data){
								result.questions = data; 
								res.json(result); 
							});
			});
		});
  };

  this.add = function(quiz, res) {
    connection.acquire(function(err, con) {
	  var questions = quiz.questions;
	  quiz = {
		  name : quiz.name
	  }		
	  
      var query = con.query('insert into quizes set ?', quiz, function(err, result) {		
		
		var quizDto = {
			id : result.insertId,
			name : question.name,
			questions : questions
		};
		
		quizDto.questions.map(function(question) {
			return question.quizId = result.insertId;
		});
		
        if (err)	throw err;
		else 		question.add(quizDto);
        
      });
		
		con.release();

    });
  };

  this.update = function(question, res) {
	//updateAnswers(question);
    connection.acquire(function(err, con) {
      con.query('update questions set ? where id = ?', [question, question.id], function(err, result) {
        con.release();
        if (err) {
          res.send({status: 1, message: 'Failed to update the question'});
        } else {
          res.send({status: 0, message: 'The question updated successfully'});
        }
      });
    });
  };

  this.delete = function(id, res) {
	//removeAnswers(question);
    connection.acquire(function(err, con) {
      con.query('delete from questions where id = ?', [id], function(err, result) {
        con.release();
        if (err) {
          res.send({status: 1, message: 'Failed to delete the question'});
        } else {
          res.send({status: 0, message: 'The question deleted successfully'});
        }
      });
    });
  };
}

module.exports = new Quiz();