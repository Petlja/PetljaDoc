from pathlib import Path
class ExternalLink:
    def __init__(self,text,link):
        self.text = text
        self.link = link

class Activity:
    def __init__(self,activity_type,title,src,guid,description):
        self.activity_type = activity_type
        self.title = title
        self.src = src
        tmp_guid = guid.rsplit('/')
        self.guid = tmp_guid[0]
        self.alias = ''
        if len(tmp_guid)>1:
            self.alias = tmp_guid[1]
        self.description = description

    def get_src_ext(self):
        if len(self.src.rsplit('.'))>1:
            return self.src.rsplit('.')[1]
        return ''

class Lesson:
    def __init__(self,title,guid,description,archived_activities,active_activities):
        self.title = title
        self.guid = guid
        self.description = description
        self.archived_activities = archived_activities
        self.active_activies = active_activities


class Course:
    def __init__(self,courseId,lang,title,willlearn,requirements,toc,extranalLinks,
                 archived_lessons,active_lessons):
        self.courseId = courseId
        self.lang = lang
        self.title = title
        self.willlearn = willlearn
        self.requirements= requirements
        self.toc = toc
        self.externalLinks = extranalLinks
        self.archived_lessons = archived_lessons
        self.active_lessons = active_lessons


    def guid_check(self):
        guid_list = self.archived_lessons
        for lesson in self.active_lessons:
            guid_list = guid_list + lesson.archived_activities
            guid_list.append(lesson.guid)
            for activity  in lesson.active_activies:
                guid_list.append(activity.guid)
        guid_list = duplicates(guid_list)
        return len(guid_list)==0,guid_list

    def source_check(self):
        missing_activities_src = []
        missing_activities = []
        missing_flag = True
        for lesson in self.active_lessons:
            for activity in lesson.active_activies:
                if activity.activity_type in ['reading','quiz']:
                    if activity.get_src_ext() == 'rst':
                        if not Path('_sources/'+lesson.title+'/'+activity.src).is_file():
                            missing_activities_src.append('_sources/'+lesson.title+'/'+activity.src)
                            missing_activities.append(activity.title)
                            missing_flag = False
                    if activity.get_src_ext() == 'pdf':
                        if not Path('_static/'+activity.src).is_file():
                            missing_activities_src.append('_static/'+activity.src)
                            missing_activities.append(activity.title)
                            missing_flag = False
        return missing_flag, missing_activities , missing_activities_src

class PetljadocError:
    ERROR_ID = 'Missing required attribute "courseId" (Top level).'
    ERROR_LANG = 'Missing required attribute "lang" (Top level).'
    ERROR_TITLE ='Missing required attribute "title" (Top level).'
    ERROR_DESC = 'Missing required attribute "description" (Top level).'

    ERROR_WILL_LEARN ='In "description" (line: {}). Missing required attribute "willLearn".'
    ERROR_REQUIREMENTS = 'In "description" (line: {}). Missing required attribute "requirements".'
    ERROR_TOC = 'In "description" (line: {}). Missing required attribute "toc" (Table of content).'

    ERROR_EXTERNAL_LINKS_TEXT = 'In "externalLinks" (line: {}). External link {} is missing required attribute "text".'
    ERROR_EXTERNAL_LINKS_LINK = 'In "externalLinks" (line: {}). External link {} is missing required attribute "link".'

    ERROR_LESSONS = 'Missing required attribute "lessons"  (Top level).'

    ERROR_ARCHIVED_LESSON = 'In "archived-lessons" (line: {}). Lesson {} is missing required attribute "guid".'

    ERROR_LESSON_TITLE = 'In "lessons" (line: {}). Lesson {} is missing the required attribute "title".'
    ERROR_LESSON_GUID = 'In "lessons" (line: {}). Lesson {} is missing the required attribute "guid".'
    ERROR_LESSON_ACTIVITIES = 'In "lessons" (line: {}). Lesson {} is missing the required attribute "activities".'

    ERROR_ACTIVITY_TYPE= 'In "lesson" {}. Activity {} (line: {}) is missing the required attribute "type".'
    ERROR_ACTIVITY_TITLE = 'In "lesson" {}. Activity {} (line: {}) is missing the required attribute "title".'
    ERROR_ACTIVITY_GUID = 'In "lesson" {}. Activity {} (line: {}) is missing the required attribute "guid".'
    ERROR_ACTIVITY_SRC = 'In "lesson" {}. Activity {} (line: {}) is missing required attribute source (file or url).'

    ERROR_ARCHIVED_ACTIVITY = 'In "archived-activities" {} (line: {}) missing required attribute "guid".'

    ERROR_DUPLICATE_GUID = 'Duplicated GUID found: {}.'

    ERROR_SOURCE_MISSING = 'Activity "{}" source missing. File should be here:\n > {}'
    ERROR_MSG_BUILD = 'Build stopped.'
    ERROR_MSG_YAML = 'Yaml could not be loaded.'

def duplicates(guid_list):
    seen = {}
    dupes = []

    for el in guid_list:
        if el not in seen:
            seen[el] = 1
        else:
            if seen[el] == 1:
                dupes.append(el)
            seen[el] += 1
    return dupes
