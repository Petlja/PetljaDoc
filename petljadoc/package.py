import xml.etree.cElementTree as ET
import lxml.etree as etree
import yaml
import cyrtranslit


def load_course():
    with open('_build/index.yaml', encoding='utf8') as f:
        return yaml.load(f, Loader=yaml.FullLoader)

def create_SCORM_manifest():
    manifest = ET.Element("manifest", 
                    identifier="com.scorm.golfsamples.runtime.minimumcalls.12",
                    version="1",
                    xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2")
                    
    manifest.set("xmlns:adlcp","http://www.adlnet.org/xsd/adlcp_rootv1p2")
    manifest.set("xmlns:xsi","http://www.w3.org/2001/XMLSchema-instance")
    manifest.set("xsi:schemaLocation","http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd\nhttp://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd\n http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd")

    metadata = ET.SubElement(manifest,"metadata")

    data = load_course()

    ET.SubElement(metadata, "schema").text = "ALD SCORM" #Ime Kursa
    ET.SubElement(metadata, "schemaversion").text = "1.2"


    organizations = ET.SubElement(manifest,"organizations", default="petlja_org")
    resources = ET.SubElement(manifest,"resources")


    organization= ET.SubElement(organizations, "organization", identifier="petlja_org")

    ET.SubElement(organization, "title").text = cyrtranslit.to_latin(data['title']) #Ime Kursa
    i = 0
    #sve lekcije
    for lesson in data['lessons']:
        i=i+1
        #Lekcija
        item_lekcija = ET.SubElement(organization, "item", identifier="lesson_"+str(i))
        ET.SubElement(item_lekcija, "title").text =cyrtranslit.to_latin(lesson['title'])
        j = 0
        #sve aktivnosti 
        for activity in lesson['activities']:
            j=j+1
        #Aktivnost
            item = ET.SubElement(item_lekcija, "item", identifier="activity_"+str(i)+"_"+str(j)+"_item", identifierref="activity_"+str(i)+"_"+str(j))
            ET.SubElement(item, "title").text = cyrtranslit.to_latin(activity['title'])
            resource = ET.SubElement(resources, "resource", identifier="activity_"+str(i)+"_"+str(j),type="webcontent" , href=lesson['folder']+"/"+activity['file'])
            resource.set("adlcp:scormtype","sco")
        



    tree = ET.ElementTree(manifest)
    tree.write("_build/imsmanifest.xml")

    x = etree.parse("_build/imsmanifest.xml")
    with open("_build/imsmanifest.xml",mode="w+",encoding="utf-8") as file:
        file.write(etree.tostring(x, pretty_print=True, encoding = str))


