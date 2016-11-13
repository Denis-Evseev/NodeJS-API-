var connection = require('../connection');

function Answer() {
  this.getAllByQuestionId = function(questionId, res) {
	var answersId = questionToAnswer.getAnswerIdsByQuestionId(questionId);
	var answers = [];
	
    connection.acquire(function(err, con) {
		for(var i=0; i < answersId.length; i++){
			con.query('select * from answers where `id`= ?', answersId[i], function(err, result) {
				answers.push(result);
				console.log("The length of answers: " + answers.length + "(" + result + ")");
			});
		}
		
		con.release();
		res.send(answers);
    });
  };

  this.add = function(questionDto, res) {
    connection.acquire(function(err, con) {
		
		for(var i = 0; i < questionDto.answers.length ; i++)
			con.query('insert into `answers` set ?', questionDto.answers[i], function(err, result){
				if (err) throw err;
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

module.exports = new Answer();