"""
Test pygamelib directive
"""

__author__ = 'Petlja'

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


class PygamelibTests(RunestoneTestCase):
     
    def test_general(self):
        """
        Directive heavily associated with :activecode 
        The only thing being tested is loading of pygame module
        """
        self.driver.get(self.host + "/index.html")
        self.driver.execute_script('window.localStorage.clear();')
        t1 = self.driver.find_element_by_id("test1")
        self.assertIsNotNone(t1)
        rb = t1.find_element_by_class_name("run-button")
        self.assertIsNotNone(rb)
        rb.click()
        try:
            self.assertIsNone(t1.find_element_by_class_name("alert-danger"))
        except NoSuchElementException:
            pass
        else:
            self.fail()



    
        
if __name__ == '__main__':
    unittest.main()
