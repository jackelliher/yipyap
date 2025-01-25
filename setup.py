from setuptools import setup, find_packages

_ = setup(
    name="audio_recorder",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "sounddevice>=0.4.5",
        "scipy>=1.9.0",
    ],
    entry_points={
        'console_scripts': [
            'audio_recorder=audio_recorder.main:main',
        ],
    },
)

