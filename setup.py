import setuptools
import petljadoc

with open("README.md", "r") as fh:
    long_description = fh.read()

with open('requirements.txt', 'r') as fh:
    dependencies = [l.strip() for l in fh if not l.strip()]

setuptools.setup(
    python_requires=">=3.6",
    name="petljadoc",
    version=petljadoc.__version__,
    author="Fondacija Petlja",
    author_email="team@petlja.org",
    description="Petlja's command-line interface for learning content",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/Petlja/PetljaDoc",
    include_package_data=True,
    zip_safe=False,
    packages=setuptools.find_packages(),
    classifiers=[
        'Programming Language :: Python :: 3.6'
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        'Topic :: Education',
        'Topic :: Text Processing :: Markup'
    ],
    entry_points={
        'console_scripts': [ 'petljadoc = petljadoc.cli:main' ],
        'sphinx.html_themes': [ 'bootstrap_petlja_theme = petljadoc.bootstrap_petlja_theme' ]
    }
)
