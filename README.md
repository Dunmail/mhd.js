mhd.js
======

Overview
--------
Node.js implementation of IHE MHD, providing a RESTful API to access health documents from mobile devices.

MHD is an IHE profile for Mobile access to Health Documents. The implementation follows [trial implementation rev1.1](http://www.ihe.net/Technical_Framework/upload/IHE_ITI_Suppl_MHD.pdf) and provides a MHD Document Responder actor using an XDS Document Consumer as a proxy to XDS registry/repository.

This is a partial implementation:
- findDocumentDossiers supports only XDSDocumentEntryPatientId parameter
- audit supports only local logs
- document posting not implemented

Installation
------------
    npm install mhd.js

Testing
-------
    npm test

Use
---


Acknowledgements
----------------
Ongoing development funded by Black Pear Software Ltd
Work funded in part by NHS Information Sharing Challenge Fund
