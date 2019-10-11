"""
Test karel directive
"""

__author__ = 'Jovan'

import unittest
import time
from unittest import TestCase
from runestone.unittest_base import module_fixture_maker, RunestoneTestCase
from selenium.webdriver import ActionChains
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.by import By
import selenium.webdriver.support.ui as ui

mf, setUpModule, tearDownModule = module_fixture_maker(__file__, True)


class KarelTests(RunestoneTestCase):
     
    def test_general(self):
        
         """
         Testing of a correct Karel program
         """
         self.driver.get(self.host + "/index.html") 
         self.driver.execute_script('window.localStorage.clear();')
         t1 = self.driver.find_element_by_css_selector("div[data-childcomponent='Karel']")
         karel = t1.find_element_by_class_name('course-content')
         self.assertIsNotNone(karel)

         checkme = t1.find_element_by_class_name('run-button')
         checkme.click()      
         message = t1.find_element_by_class_name('alert')    
    
         self.assertEqual(message.get_attribute("class"),"col-md-12 alert alert-success")
         reset = t1.find_element_by_class_name('reset-button')
         reset.click()
         self.assertEqual(len(karel.find_elements_by_id("Karel-success")),0)
  
    def test_wrong(self):
         """
         Testing of an incorrect Karel program(robot crashes into a wall)
         """
         self.driver.get(self.host + "/index.html") 
         self.driver.execute_script('window.localStorage.clear();')
         t2 = self.driver.find_element_by_css_selector("div[data-childcomponent='Karel_2']")
         karel = t2.find_element_by_class_name('course-content')
         self.assertIsNotNone(karel)

         checkme = t2.find_element_by_class_name('run-button')
         checkme.click()      

         message = t2.find_element_by_class_name('alert')    
    
         self.assertEqual(message.get_attribute("class"),"col-md-12 alert alert-danger")
         reset = t2.find_element_by_class_name('reset-button')
         reset.click()
         self.assertEqual(len(karel.find_elements_by_id("Karel_2-error")),0)

    def test_syntax(self):
         """
         Testing if a syntax error is correctly detected and signaled
         """
         self.driver.get(self.host + "/index.html") 
         self.driver.execute_script('window.localStorage.clear();')

         t3 = self.driver.find_element_by_css_selector("div[data-childcomponent='Karel_3']")
         karel = t3.find_element_by_class_name('course-content')
         self.assertIsNotNone(karel)

         checkme = t3.find_element_by_class_name('run-button')
         checkme.click()      

         self.assertIsNotNone(t3.find_element_by_class_name('error'))
         
        
        
if __name__ == '__main__':
    unittest.main()
