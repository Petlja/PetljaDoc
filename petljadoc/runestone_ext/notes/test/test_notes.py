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


class NoteTests(RunestoneTestCase):
     
    def test_general(self):
        """
        Testing generated css
        """
        self.driver.get(self.host + "/index.html")
        note1 = self.driver.find_element_by_class_name("course-box-special")
        note2 = self.driver.find_element_by_class_name("course-box-info")

        self.assertEqual(note1.value_of_css_property("background-color"),'rgba(217, 232, 242, 1)')
        self.assertEqual(note2.value_of_css_property("border-top"),'5px solid rgb(52, 152, 219)')
        self.assertEqual(note2.value_of_css_property("background-color"),'rgba(255, 255, 255, 1)')
              
        
        
if __name__ == '__main__':
    unittest.main()
