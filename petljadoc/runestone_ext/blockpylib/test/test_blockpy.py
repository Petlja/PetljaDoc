"""
Test blockpy directive
"""

__author__ = 'Jovan'

import unittest
import time
from unittest import TestCase
from runestone.unittest_base import module_fixture_maker, RunestoneTestCase
from selenium.webdriver import ActionChains
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
import selenium.webdriver.support.ui as ui

mf, setUpModule, tearDownModule = module_fixture_maker(__file__, True)
jquery_url = "http://code.jquery.com/jquery-1.12.4.min.js"

class BlockpyTest(RunestoneTestCase):

    def test_blockly_karel_transition(self):
         """
         Testing that changing Blockly will be saved in Karel code
         """
         self.driver.get(self.host + "/index.html")  
         self.driver.execute_script('window.localStorage.clear();')
         actionChains = ActionChains(self.driver)

         #going into blockly window
         rb = self.driver.find_element_by_class_name("blockly-button")
         self.assertIsNotNone(rb)
         rb.click()

        
         #selecting and draging "move" piece on to the canvas placing it into "for loop block"
         karel = self.driver.find_element_by_id(":1")
         karel.click()
       
         getBlocklyElement(self, 0)
         piece = self.driver.find_element_by_class_name("blocklySelected")
         actionChains.click_and_hold(piece).perform()
         actionChains.move_by_offset(140, 35).release(piece).perform()
        
         #back to karel
         back = self.driver.find_elements_by_class_name("btn-primary")[1]
         self.assertIsNotNone(back)
         back.click()

         #checking if code is in sync with blockly
         code = self.driver.find_element_by_class_name("CodeMirror-code")
         self.assertEqual(code.text, '1\nfrom karel import * \n2\nmove()\n3')
 
    def test_success(self):
         """
         Testing a simple karel program made in blockly window.
         Becouse multiple modules are tested this could be regarded as integration test.
         """
         self.driver.get(self.host + "/index.html")  
         self.driver.execute_script('window.localStorage.clear();')

         actionChains = ActionChains(self.driver)
         actionChains2 = ActionChains(self.driver)
         actionChains3 = ActionChains(self.driver)
         actionChains4 = ActionChains(self.driver)
        #going into blockly window
         rb = self.driver.find_element_by_class_name("blockly-button")
         self.assertIsNotNone(rb)
         rb.click()

        #selecting and draging "move" piece on to the canvas
         karel = self.driver.find_element_by_id(":1")
         self.assertIsNotNone(karel)
  
         karel.click()
         getBlocklyElement(self, 0)
         piece = self.driver.find_element_by_class_name("blocklySelected")
         actionChains.drag_and_drop_by_offset(piece, 100, 0).perform()
        
        #selecting and draging "move" piece on to the canvas
         karel.click()
         getBlocklyElement(self, 0)
         piece = self.driver.find_element_by_class_name("blocklySelected")
         actionChains2.click_and_hold(piece).perform()
         actionChains2.move_by_offset(100, 12).release(piece).perform()
        
        #selecting and draging "move" piece on to the canvas
         karel.click()
         getBlocklyElement(self, 0)
         piece = self.driver.find_element_by_class_name("blocklySelected")
         actionChains3.click_and_hold(piece).perform()
         actionChains3.move_by_offset(100, 12).release(piece).perform()
         
         #selecting and draging "pickup" piece on to the canvas
         karel.click()
         getBlocklyElement(self, 3)
         piece = self.driver.find_element_by_class_name("blocklySelected")
         actionChains4.click_and_hold(piece).perform()
         actionChains4.move_by_offset(100, -75).release(piece).perform()

        #going back to karel
         back = self.driver.find_elements_by_class_name("btn-primary")[1]
         self.assertIsNotNone(back)
         back.click()
       
        #running program
         run = self.driver.find_element_by_class_name("run-button")
         self.assertIsNotNone(run)
         run.click()
        
        #checking if the program finished successfully
         self.assertIsNotNone(self.driver.find_element_by_class_name("alert-success"))
   
    def test_failure(self):
         """
         Testing a simple karel program made in blockly window.
         Checking if incorecct program produces a correct error message
         """
         self.driver.get(self.host + "/index.html")  
         self.driver.execute_script('window.localStorage.clear();')

         actionChains = ActionChains(self.driver)
         
        #going into blockly window
         rb = self.driver.find_element_by_class_name("blockly-button")
         self.assertIsNotNone(rb)
         rb.click()

         karel = self.driver.find_element_by_id(":1")
         self.assertIsNotNone(karel)
  
        #going back to karel
         back = self.driver.find_elements_by_class_name("btn-primary")[1]
         self.assertIsNotNone(back)
         back.click()
        #running empty code
         run = self.driver.find_element_by_class_name("run-button")
         self.assertIsNotNone(run)
         run.click()
        #testing if error is displayed correctly
         self.assertIsNotNone(self.driver.find_element_by_class_name("alert-danger"))

    def test_loop(self):
        """
         Testing options: creating variable and fusing multiple blockly blocks into one.
         Becouse multiple modules are tested this could be regarded as integration test.
         """
        self.driver.get(self.host + "/index.html")  
        self.driver.execute_script('window.localStorage.clear();')
        actionChains = ActionChains(self.driver)
        actionChains2 = ActionChains(self.driver)
        actionChains3 = ActionChains(self.driver)
        actionChains4 = ActionChains(self.driver)
        actionChains5 = ActionChains(self.driver)
        actionChains6 = ActionChains(self.driver)

        #going into blockly window
        rb = self.driver.find_element_by_class_name("blockly-button")
        self.assertIsNotNone(rb)
        rb.click()

        #selecting and draging "for loop" piece on to the canvas
        karel = self.driver.find_element_by_id(":4")
        self.assertIsNotNone(karel)
        karel.click()

        blocklyCanvas = self.driver.find_elements_by_class_name("blocklyBlockCanvas")[1]
        pice1 = blocklyCanvas.find_elements_by_tag_name("rect")[0]
        time.sleep(.5)
        pice1.click()
  
        piece = self.driver.find_element_by_class_name("blocklySelected")
        actionChains.drag_and_drop_by_offset(piece, 100, 0).perform()
        
        #selecting and draging "move" piece on to the canvas placing it into "for loop block"
        karel = self.driver.find_element_by_id(":1")
        karel.click()
       
        getBlocklyElement(self,0)
        piece = self.driver.find_element_by_class_name("blocklySelected")
        actionChains2.click_and_hold(piece).perform()
        actionChains2.move_by_offset(140,35).release(piece).perform()
         
        #selecting and draging "pickup" piece on to the canvas placing it into "for loop block"
        karel.click()
        getBlocklyElement(self,3)
        piece = self.driver.find_element_by_class_name("blocklySelected")
        actionChains4.click_and_hold(piece).perform()
        actionChains4.move_by_offset(100,-75).release(piece).perform()

        #selecting and draging "range" piece on to the canvas placing it into "for loop block"
        karel = self.driver.find_element_by_id(":c")
        karel.click()
        getBlocklyElementRect(self,-1)
        piece = self.driver.find_element_by_class_name("blocklySelected")

        #init for new variable, name input is done in alert window
        karel = self.driver.find_element_by_id(":2")
        karel.click()
        newVariable = self.driver.find_elements_by_class_name("blocklyBlockCanvas")[1].find_element_by_class_name("blocklyText")
        newVariable.click()
        try:
            WebDriverWait(self.driver, 3).until(EC.alert_is_present(),
                                   'Timed out waiting for PA creation ' +
                                   'confirmation popup to appear.')
            alertWindow = self.driver.switch_to.alert 
            alertWindow.send_keys('i')
            alertWindow.accept()
        except TimeoutException:
             print("no alert")

        getBlocklyElement(self,1)
        piece = self.driver.find_element_by_class_name("blocklySelected")
        actionChains5.click_and_hold(piece).perform()
        actionChains5.move_by_offset(170,-75).release(piece).perform()
        
        #selecting and draging "range attributes" piece on to the canvas placing it into "range block"
        karel = self.driver.find_element_by_id(":a")
        karel.click()
       
        getBlocklyElement(self,1)
        piece = self.driver.find_element_by_class_name("blocklySelected")
        actionChains6.click_and_hold(piece).perform()
        actionChains6.move_by_offset(335,-40).release(piece).perform()
         
         
        pieceInput = self.driver.find_element_by_class_name("blocklyEditableText")
        webdriver.ActionChains(self.driver).move_to_element(pieceInput ).click(pieceInput ).perform()
        time.sleep(.5)

        #setting range(3)
        pieceInput2 = self.driver.find_element_by_class_name("blocklyWidgetDiv").find_element_by_class_name("blocklyHtmlInput")
        self.assertIsNotNone(pieceInput2)
        self.driver.execute_script("arguments[0].value=3;", pieceInput2)
        time.sleep(.5)
        
        #after setting input to 3, moving focus to another element in order to save it 
        workSpace = self.driver.find_element_by_class_name("blocklyWorkspace")
        self.assertIsNotNone(workSpace)
        workSpace.click()
        
        #back to karel
        back = self.driver.find_elements_by_class_name("btn-primary")[1]
        self.assertIsNotNone(back)
        back.click()


        run = self.driver.find_element_by_class_name("run-button")
        self.assertIsNotNone(run)
        run.click()

        self.assertIsNotNone(self.driver.find_element_by_class_name("alert-success"))


        

def getBlocklyElement(self, elementNo):
    blocklyCanvas = self.driver.find_elements_by_class_name("blocklyBlockCanvas")[1]
    piece = blocklyCanvas.find_elements_by_class_name("blocklyDraggable")[elementNo]
    time.sleep(.5)
    piece.click()

def getBlocklyElementRect(self, elementNo):
    blocklyCanvas = self.driver.find_elements_by_class_name("blocklyBlockCanvas")[1]
    piece = blocklyCanvas.find_elements_by_tag_name("rect")[elementNo]
    time.sleep(.5)
    actionChains3= ActionChains(self.driver)
    actionChains3.click_and_hold(piece).perform()
    actionChains3.move_by_offset(-20,-20).move_by_offset(270,-210).release(piece).perform()

if __name__ == '__main__':
    unittest.main()
