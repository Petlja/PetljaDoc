from typing import Dict
import xml.etree.cElementTree as ET
import lxml.etree as etree
import yaml
import cyrtranslit
import os
import uuid
from . import util
import shutil
import copy

class ScormPackager:      
    def __init__(self) -> None:
        manifest = ET.Element("manifest", 
                    identifier="manifest",
                    version="1.0",
                    xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2")
                    
        manifest.set("xmlns:adlcp","http://www.adlnet.org/xsd/adlcp_rootv1p2")
        manifest.set("xmlns:xsi","http://www.w3.org/2001/XMLSchema-instance")
        manifest.set("xsi:schemaLocation","http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd")

        metadata = ET.SubElement(manifest,"metadata")

        ET.SubElement(metadata, "schema").text = "ADL SCORM" 
        ET.SubElement(metadata, "schemaversion").text = "1.2"


        organizations = ET.SubElement(manifest,"organizations", default="petlja_org")
        resources = ET.SubElement(manifest,"resources")

        common_resource = ET.SubElement(resources,"resource", identifier="common_files", type="webcontent")
        common_resource.set("adlcp:scormtype","asset")

        for root, _, files in os.walk(os.path.join("_build","_static")):
            for file in files:
                relative_path = os.path.join(root,file).replace("_build",".").replace("\\",'/')
                file = ET.SubElement(common_resource,"file",href=relative_path)  

        for root, _, files in os.walk(os.path.join("_build","_static")):
            for file in files:
                relative_path = os.path.join(root,file).replace("_build",".").replace("\\",'/')
                file = ET.SubElement(common_resource,"file",href=relative_path)  

        self.manifest_template = [manifest, organizations, resources]
    
    # path = '_build/index.yaml'
    def load_data_from_yaml(self, path = "_build/index.yaml") -> bool:
        try:
            with open(path, encoding='utf8') as f:
                self.course_data = yaml.load(f, Loader=yaml.FullLoader)
                return True
        except IOError: 
            self.course_data = None
            return False

    def create_package(self, path = "_build") -> None:
        if self.course_data:
            manifest, organizations, resources = copy.deepcopy(self.manifest_template)
            organization= ET.SubElement(organizations, "organization", identifier="petlja_org")
            ET.SubElement(organization, "title").text = cyrtranslit.to_latin(self.course_data['title']) 
            lecture_item = ET.SubElement(organization, "item", identifier="home_page")
            ET.SubElement(lecture_item, "title").text = "Home Page"
            activity_item = ET.SubElement(lecture_item, "item", identifier="indexid", identifierref="index")
            ET.SubElement(activity_item, "title").text = "Info"
            resource = ET.SubElement(resources, "resource", identifier="index", type="webcontent", href="index.html")
            resource.set("adlcp:scormtype","sco")
            ET.SubElement(resource, "file", href="index.html")
            for lesson in self.course_data['lessons']:
                lecture_item = ET.SubElement(organization, "item", identifier=lesson['guid'][0:8])
                ET.SubElement(lecture_item, "title").text = cyrtranslit.to_latin(lesson['title']) 
                for activity in lesson['activities']:
                    resource_id = (lesson['title'] + '_' +activity['title']).replace(" ","_")
                    activity_item = ET.SubElement(lecture_item, "item", identifier=activity['guid'][0:8], identifierref=resource_id)
                    ET.SubElement(activity_item, "title").text = cyrtranslit.to_latin(activity['title'])
                    resource = ET.SubElement(resources, "resource", identifier=resource_id, type="webcontent", href=os.path.join(lesson['folder'], activity['file']).replace("\\","/"))
                    resource.set("adlcp:scormtype","sco")
                    ET.SubElement(resource, "file", href=os.path.join(lesson['folder'], activity['file']).replace("\\","/"))
                    ET.SubElement(resource, "dependency", identifierref="common_files")
   
            path = os.path.join(path,"imsmanifest.xml")
            tree = ET.ElementTree(manifest)
            tree.write(path)

            x = etree.parse(path)
            with open(path, mode="w+", encoding="utf-8") as file:
                file.write(etree.tostring(x, pretty_print=True, encoding = str))             

    def zip_file(self, path="_build", folder_name = "SCROM_COURSE") -> None:
        util.copy_dir(path, folder_name, util.filter_name)
        shutil.make_archive(folder_name, 'zip', folder_name)
        shutil.rmtree(folder_name)


    def create_packages_for_lectures(self, path = 'SCORM_LECTURE_PACKAGES') -> None:
         if self.course_data:
            if not os.path.exists(path):
                os.mkdir(path)
            for lesson in self.course_data['lessons']:
                if not os.path.exists(os.path.join(path,lesson['title'])):
                    os.mkdir(os.path.join(path,lesson['title']))
                util.copy_dir("_build/",os.path.join(path,lesson['title']), util.filter_name)
                for lesson2 in self.course_data['lessons']:
                    if lesson2 != lesson:
                        shutil.rmtree(os.path.join(path,lesson2['title']))
                manifest, organizations, resources = copy.deepcopy(self.manifest_template)
                organization= ET.SubElement(organizations, "organization", identifier="petlja_org") 
                ET.SubElement(organization, "title").text = cyrtranslit.to_latin(lesson['title']) 
                lecture_item = ET.SubElement(organization, "item", identifier=lesson['guid'])
                for activity in lesson['activities']:
                    resource_id = (lesson['title'] + '_' +activity['title']).replace(" ","_")
                    activity_item = ET.SubElement(lecture_item, "item", identifier=activity['guid'], identifierref=resource_id)
                    ET.SubElement(activity_item, "title").text = cyrtranslit.to_latin(activity['title'])
                    resource = ET.SubElement(resources, "resource", identifier=resource_id, type="webcontent", href=os.path.join(lesson['folder'], activity['file']).replace("\\","/"))
                    resource.set("adlcp:scormtype","sco")
                    ET.SubElement(resource, "file", href=os.path.join(lesson['folder'], activity['file']).replace("\\","/"))
                    ET.SubElement(resource, "dependency", identifierref="common_files")

                tree = ET.ElementTree(manifest)

                manifest_path = os.path.join(os.path.join(path,lesson['title']),"imsmanifest.xml")
                tree.write(manifest_path)

                x = etree.parse(manifest_path)
                with open(manifest_path, mode="w+", encoding="utf-8") as file:
                    file.write(etree.tostring(x, pretty_print=True, encoding = str))  

                shutil.make_archive(os.path.join(path,lesson['title']), 'zip',os.path.join(path,lesson['title']))
                shutil.rmtree(os.path.join(path,lesson['title']))

