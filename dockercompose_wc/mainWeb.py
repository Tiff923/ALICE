# all the imports
from __future__ import print_function
import os
from os import listdir
from os.path import isfile, join
import imghdr
import shutil
from shutil import copyfile
import sys
import subprocess

from flask import Flask, request, session, g, redirect, url_for, abort, \
	render_template, flash, json, jsonify, Response
import requests
import re

from flask_restful import reqparse, abort, Api, Resource
from distutils.dir_util import copy_tree
from werkzeug import secure_filename


#import easygui
#import pymsgbox

from flask import Flask
app = Flask(__name__)
app._static_folder = './static/'

# This is the path to the upload directory
app.config['UPLOAD_FOLDER'] = 'uploads/'
# These are the extension that we are accepting to be uploaded
app.config['ALLOWED_EXTENSIONS'] = set(['txt', 'eml'])

# For a given file, return whether it's an allowed type or not
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in app.config['ALLOWED_EXTENSIONS']

# Route that will process the file upload
@app.route('/upload', methods=['POST'])
def upload():
    # Get the name of the uploaded files
    uploaded_files = request.files.getlist("file[]")
    filenames = []
    for file in uploaded_files:
        # Check if the file is one of the allowed types/extensions
        if file and allowed_file(file.filename):
            # Make the filename safe, remove unsupported chars
            filename = secure_filename(file.filename)
            # Move the file form the temporal folder to the upload folder we setup
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            # Save the filename into a list, we'll use it later
            filenames.append(filename)
	    file.close()
            # Redirect the user to the uploaded_file route, which
            # will basicaly show on the browser the uploaded file
    # Load an html page with a link to each uploaded file
    return render_template('upload.html', filenames=filenames)

# This route is expecting a parameter containing the name
# of a file. Then it will locate that file on the upload
# directory and show it on the browser, so if the user uploads
# an image, that image is going to be show after the upload
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'],
                               filename)

@app.route('/')
def index():
	#easygui.msgbox("This is a message!", title="simple gui")
	#pymsgbox.alert('This is an alert!', 'Title')
	return render_template('start.html')

#@app.route('/login') 
#def login():
#	print 'test'
#        return "Login ok"

@app.route('/wordcloud') 
def wordcloud():
	url = 'http://wordclouddocker:8000/wordcloud_api'
	textData = json.dumps({"data": "this is Tom"})
	headers = {'Content-type': 'application/json'}
		
	try:
		resp = requests.post(url=url, json=textData, headers=headers) 	
		imgvalue = resp.text.decode('UTF-8')		
		
	except Exception as e:
		return e
	
	return render_template('wordcloud_response.html', imgvalue=imgvalue)


			
if __name__ == '__main__':
	#app.run(host='0.0.0.0')
	app.run(host='0.0.0.0', debug=True, port=5000)



