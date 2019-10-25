=====================
Blockly Test
=====================

.. karel:: Карел_иди_напред_док_можеш
   :blockly:

   {
      setup: function() {
           function random(n) {
              return Math.floor(n * Math.random());
	   }

	   var N = 4 ;
	   var world = new World(N, 1);
           world.setRobotStartAvenue(1);
           world.setRobotStartStreet(1);
           world.setRobotStartDirection("E");
	   world.putBall(N, 1);
           var robot = new Robot();
	   var code = ["from karel import *"]
	   return {world: world, robot: robot, code: code};
      },

      isSuccess: function(robot, world) {
           var lastAvenue = world.getAvenues();
           return robot.getStreet() === 1 &&
           robot.getAvenue() === lastAvenue &&
	   world.getBalls(lastAvenue, 1) == 0;
      }
   }
   