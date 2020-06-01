from pathlib import Path

class Activity:
    def __init__(self,activity_type,title,src,guid,description):
        self.activity_type = activity_type
        self.title = title
        self.src = src
        self.guid = guid
        self.description = description

    def get_src_ext(self):
        return self.src.rsplit('.')[1]

class Lesson:
    def __init__(self,title,guid,description,archived_activities,active_activities):
        self.title = title
        self.guid = guid
        self.description = description
        self.archived_activities = archived_activities
        self.active_activies = active_activities


class Course:
    def __init__(self,courseId,lang,title,willlearn,requirements,toc,extranalLinks,archived_lessons,active_lessons):
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
        active_lessons_guids = []
        active_activities = []
        for lesson in self.active_lessons:
            active_lessons_guids.append(lesson.guid)
            for activity in lesson.active_activies:
                active_activities.append(activity.guid)

        return len(self.archived_lessons) == len(set(self.archived_lessons)) and len(active_lessons_guids) == len(set(active_lessons_guids)) and len(active_activities) == len(set(active_activities))

    def source_check(self):
        missing_activities = []
        missing_flag = True
        for lesson in self.active_lessons:
            for activity in lesson.active_activies:
                if activity.activity_type in ['reading','quiz']:
                    if activity.get_src_ext() == 'rst':
                        if not Path('_sources/'+lesson.title+'/'+activity.src).is_file():
                            missing_activities.append('_sources/'+lesson.title+'/'+activity.src)
                            missing_flag = False
                    if activity.get_src_ext() == 'pdf':
                        if not Path('_static/'+activity.src):
                            missing_activities.append('_static/'+activity.src)
                            missing_flag = False
        return missing_flag, missing_activities

class PetljadocError:
    ERROR_ID = 'Petljadoc INDEX structure error: No courseId found.'
    ERROR_LANG = 'Petljadoc INDEX structure error: No lang found.'
    ERROR_TITLE ='Petljadoc INDEX structure error: No title found.'
    ERROR_DESC = 'Petljadoc INDEX structure error: No description found.'
    ERROR_WILL_LEARN = 'willLearn','Petljadoc INDEX structure error: No willLearn found.'
    ERROR_REQUIREMENTS = 'Petljadoc INDEX structure error: No requirements found.'
    ERROR_TOC = 'Petljadoc INDEX structure error: No table of content found.'
    ERROR_LESSONS = 'Petljadoc INDEX structure error: No lessons section found.'
    ERROR_LESSON_TITLE = 'Petljadoc INDEX structure error: Lesson {} is missing the titile.'
    ERROR_LESSON_GUID = 'Petljadoc INDEX structure error: guid missing in lesson {}.'
    ERROR_LESSON_ACTIVITIES = 'Petljadoc INDEX structure error: activities missing in lesson {}.'
    ERROR_UNKNOWN_ACTIVITY = 'Petljadoc INDEX structure error: Unknown activity in lesson {}.'
    ERROR_ACTIVITY_TITLE = 'Petljadoc INDEX structure error:\
         In Lesson {} - activity {} is missing the titile.'
    ERROR_ACTIVITY_GUID = 'Petljadoc INDEX structure error:\
         In Lesson {} - activity {} is missing the guid.'
    ERROR_ACTIVITY_SRC = 'Petljadoc INDEX structure error:\
         In Lesson {} - activity {} is missing the source(file or url).'
    ERROR_DUPLICATE_GUID = 'Petljadoc INDEX structure error: Duplicate guid.'
    ERROR_SOURCE_MISSING = 'Some activities are missing srouce files. Location checked:'
    ERROR_MSG_BUILD = 'Build stopped.'
