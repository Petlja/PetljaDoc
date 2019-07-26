import setuptools

with open("README.md", "r") as fh:
    long_description = fh.read()

with open('requirements.txt', 'r') as fh:
    dependencies = [l.strip() for l in fh if not l.strip()]

setuptools.setup(
    name="petljadoc",
    version="0.0.1",
    author="Fondacija Petlja",
    author_email="team@petlja.org",
    description="Petlja's command-line interface for learning content",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/Petlja/PetljaDoc",
    packages=setuptools.find_packages(),
    classifiers=[
        'Programming Language :: Python :: 3.6'
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        'Topic :: Education',
        'Topic :: Text Processing :: Markup'
    ],
    entry_points={
        'console_scripts': [ 'petljadoc = petljadoc.cli:main' ]
    }
)
