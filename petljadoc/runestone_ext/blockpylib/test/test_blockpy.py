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

    def test_success(self):
         self.driver.get(self.host + "/index.html")  
         self.driver.execute_script('window.localStorage.clear();')

         actionChains = ActionChains(self.driver)
         actionChains2 = ActionChains(self.driver)
         actionChains3 = ActionChains(self.driver)
         actionChains4 = ActionChains(self.driver)

         rb = self.driver.find_element_by_class_name("blockly-button")
         self.assertIsNotNone(rb)
         rb.click()

         karel = self.driver.find_element_by_id(":1")
         self.assertIsNotNone(karel)
  
         karel.click()
         getBlocklyElement(self,0)
         piece = self.driver.find_element_by_class_name("blocklySelected")
         actionChains.drag_and_drop_by_offset(piece,100,0).perform()
        
        
         karel.click()
         getBlocklyElement(self,0)
         piece = self.driver.find_element_by_class_name("blocklySelected")
         actionChains2.click_and_hold(piece).perform()
         actionChains2.move_by_offset(100,12).release(piece).perform()

         karel.click()
         getBlocklyElement(self,0)
         piece = self.driver.find_element_by_class_name("blocklySelected")
         actionChains3.click_and_hold(piece).perform()
         actionChains3.move_by_offset(100,12).release(piece).perform()
         
         karel.click()
         getBlocklyElement(self,3)
         piece = self.driver.find_element_by_class_name("blocklySelected")
         actionChains4.click_and_hold(piece).perform()
         actionChains4.move_by_offset(100,-75).release(piece).perform()


         back = self.driver.find_elements_by_class_name("btn-primary")[1]
         self.assertIsNotNone(back)
         back.click()

         run = self.driver.find_element_by_class_name("run-button")
         self.assertIsNotNone(run)
         run.click()

         self.assertIsNotNone(self.driver.find_element_by_class_name("alert-success"))
   
    def test_failure(self):
         self.driver.get(self.host + "/index.html")  
         self.driver.execute_script('window.localStorage.clear();')

         actionChains = ActionChains(self.driver)
         

         rb = self.driver.find_element_by_class_name("blockly-button")
         self.assertIsNotNone(rb)
         rb.click()

         karel = self.driver.find_element_by_id(":1")
         self.assertIsNotNone(karel)
  

         back = self.driver.find_elements_by_class_name("btn-primary")[1]
         self.assertIsNotNone(back)
         back.click()

         run = self.driver.find_element_by_class_name("run-button")
         self.assertIsNotNone(run)
         run.click()

         self.assertIsNotNone(self.driver.find_element_by_class_name("alert-danger"))

    def test_loop(self):
        self.driver.get(self.host + "/index.html")  
        self.driver.execute_script('window.localStorage.clear();')
        actionChains = ActionChains(self.driver)
        actionChains2 = ActionChains(self.driver)
        actionChains3 = ActionChains(self.driver)
        actionChains4 = ActionChains(self.driver)
        actionChains5 = ActionChains(self.driver)
        actionChains6 = ActionChains(self.driver)
        rb = self.driver.find_element_by_class_name("blockly-button")
        self.assertIsNotNone(rb)
        rb.click()

        karel = self.driver.find_element_by_id(":4")
        self.assertIsNotNone(karel)
        karel.click()

        blocklyCanvas = self.driver.find_elements_by_class_name("blocklyBlockCanvas")[1]
        pice1 = blocklyCanvas.find_elements_by_tag_name("rect")[0]
        time.sleep(.5)
        pice1.click()

        piece = self.driver.find_element_by_class_name("blocklySelected")
        actionChains.drag_and_drop_by_offset(piece,100,0).perform()
        
        karel = self.driver.find_element_by_id(":1")
        karel.click()
       
        getBlocklyElement(self,0)
        piece = self.driver.find_element_by_class_name("blocklySelected")
        actionChains2.click_and_hold(piece).perform()
        actionChains2.move_by_offset(140,35).release(piece).perform()
         
        karel.click()
        getBlocklyElement(self,3)
        piece = self.driver.find_element_by_class_name("blocklySelected")
        actionChains4.click_and_hold(piece).perform()
        actionChains4.move_by_offset(100,-75).release(piece).perform()

        karel = self.driver.find_element_by_id(":c")
        karel.click()
        getBlocklyElementRect(self,-1)
        piece = self.driver.find_element_by_class_name("blocklySelected")

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
        
        karel = self.driver.find_element_by_id(":a")
        karel.click()
       
        getBlocklyElement(self,1)
        piece = self.driver.find_element_by_class_name("blocklySelected")
        actionChains6.click_and_hold(piece).perform()
        actionChains6.move_by_offset(335,-40).release(piece).perform()
         
         
        pieceInput = self.driver.find_element_by_class_name("blocklyEditableText")
        webdriver.ActionChains(self.driver).move_to_element(pieceInput ).click(pieceInput ).perform()
        time.sleep(.5)
        pieceInput2 = self.driver.find_element_by_class_name("blocklyWidgetDiv").find_element_by_class_name("blocklyHtmlInput")
        self.assertIsNotNone(pieceInput2)
        self.driver.execute_script("arguments[0].value=3;", pieceInput2)
        time.sleep(.5)

        workSpace = self.driver.find_element_by_class_name("blocklyWorkspace")
        self.assertIsNotNone(workSpace)
        workSpace.click()

        back = self.driver.find_elements_by_class_name("btn-primary")[1]
        self.assertIsNotNone(back)
        back.click()


        run = self.driver.find_element_by_class_name("run-button")
        self.assertIsNotNone(run)
        run.click()

        self.assertIsNotNone(self.driver.find_element_by_class_name("alert-success"))
       
    def wait_for_animation(self, selector):
        is_animation_in_progress = self.is_element_animated(selector)
        while is_animation_in_progress is True:
            time.sleep(.5)
            is_animation_in_progress = self.is_element_animated(selector)


    def is_element_animated(self, selector):
        return self.driver.execute_script("return jQuery('" + selector + "').is(':animated');")


    def f_exists(self, selector_id):
        try:
            self.driver.find_element_by_id(selector_id)
        except NoSuchElementException:
            return False
        return True


    def wait_and_close_alert(self, timeout = 3):
        try:
            WebDriverWait(self.driver, timeout).until(EC.alert_is_present(),
                                   'Timed out waiting for PA creation ' +
                                   'confirmation popup to appear.')
            alert = self.driver.switch_to_alert()
            alert.accept()
            return True
        except TimeoutException:
            return False
        

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
