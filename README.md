mhd.js
======

Overview
--------
Node.js implementation of IHE MHD, providing a RESTful API to access health documents from mobile devices.

MHD is an IHE profile for Mobile access to Health Documents

Currently working from [trial implementation rev1.1](http://www.ihe.net/Technical_Framework/upload/IHE_ITI_Suppl_MHD.pdf)

Installation
------------
    git clone https://github.com/dunmail/mhd.js.git
    cd mhd.js
    npm install

Configuration
-------------
This repository includes self-signed certificates for https. These are sufficient for test purposes but signed
certificates should be used for a production system.

License
-------
Copyright 2012-2013 Dunmail Hodkinson

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
   
Acknowledgements
----------------
Work funded in part by NHS Information Sharing Challenge Fund
