var connection = require('../connection');
var answer = require('../models/answer');
var question = require('../models/question');

function Question() {
  this.getAll = function(res) {
    connection.acquire(function(err, con) {
      con.query('select * from questions', function(err, result) {
        con.release();
        res.send(result);
      });
    });
  };
	
  this.getAllByQuizId = function(quizId, callback) {
     connection.acquire(function(err, con) {
      con.query('select * from questions where `quizId` = ? ', quizId, function(err, rows) {
		if (err) callback(err); 
			
		console.log(JSON.parse(JSON.stringify(rows))); 
		callback(null, rows); 
      });
    });
	
	
  };
  

  
  this.getById = function(questionId,res) {
	connection.acquire(function(err, con) {
	  con.query('select * from questions where `id` = ? ', questionId, function(err, result) {
		con.release();
		
		result.answers = answer.getAllByQuestionId(questionId);
		console.log(result + ". The length: " + result.answers.length);
		res.send(result);
	  });
	});
  };

  //getAllByQuizId
  
  this.add = function(quizDto, res) {
    connection.acquire(function(err, con) {
		
	for(var i = 0; i < quizDto.questions.length ; i++)
	{
		var answers = quizDto.questions[i].answers;
		var question =  {
				quizId : quizDto.id,
				value : quizDto.questions[i].value,
			};
		
		var questionDto = {
				value : quizDto.questions[i].value,
				answers : answers
			};
			
		con.query('insert into questions set ?', question, function(err, result){
			if (err) {
				throw err;
			} else {
				questionDto.answers.map(function(answer) {
					return answer.questionId = result.insertId;
				});
			
				if(result.insertId !== 0) answer.add(questionDto);
			}
		});	
	}
		
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

module.exports = new Question();