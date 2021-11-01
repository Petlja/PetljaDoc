import xml.etree.cElementTree as ET
import lxml.etree as etree

manifest = ET.Element("manifest", 
                  identifier="com.scorm.golfsamples.runtime.minimumcalls.12",
                  version="1",
                  xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2")
                
manifest.set("xmlns:adlcp","http://www.adlnet.org/xsd/adlcp_rootv1p2")
manifest.set("xmlns:xsi","http://www.w3.org/2001/XMLSchema-instance")
manifest.set("xsi:schemaLocation","http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd\nhttp://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd\n http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd")

metadata = ET.SubElement(manifest,"metadata")

ET.SubElement(metadata, "schema").text = "Petlja Course" #Ime Kursa
ET.SubElement(metadata, "schemaversion").text = "1.2"


organizations = ET.SubElement(manifest,"organizations", default="petlja_org")
organization= ET.SubElement(organizations, "organization", identifier="petlja_org")

ET.SubElement(organization, "title").text = "Petlja Course" #Ime Kursa

#sve lekcije

#Lekcija
item_lekcija = ET.SubElement(organization, "item", identifier="prva_lekcija_course")
ET.SubElement(item_lekcija, "title").text = "Lekcija 1"

#sve aktivnosti 


#Aktivnost
item = ET.SubElement(item_lekcija, "item", identifier="prva_akt_playing_item", identifierref="playing_playing_resource")
ET.SubElement(item, "title").text = "Aktivnsot 1"


resources = ET.SubElement(manifest,"resources")
resource = ET.SubElement(resources, "resource", identifier="playing_playing_resource",type="webcontent" , href="1_Lesson2/Test your students.html")
resource.set("adlcp:scormtype","sco")

tree = ET.ElementTree(manifest)
tree.write("imsmanifest.xml")

x = etree.parse("imsmanifest.xml")
with open("imsmanifest.xml",mode="w+") as file:
    file.write(etree.tostring(x, pretty_print=True, encoding = str))