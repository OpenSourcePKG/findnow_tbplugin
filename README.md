# FindNow Thunderbird Addon

[FindNow](https://addons.thunderbird.net/addon/findnow/) adds export functions for messages.

[Click here to view this add-on’s version history](https://addons.thunderbird.net/addon/findnow/versions/).

[![License: GPL 3.0](https://img.shields.io/badge/License-GPL%203.0-red.png)](https://opensource.org/licenses/GPL-3.0)

## Generals
* Version: ```91.1```
* Project: ```Findnow TB for Version 91.* Thunderbird```
* Author: ```Stefan Werfling```
* Lang: ```js, ts```
* Tools: ```phpstorm```
* Last update: ```04.11.2021```

# 1. begin dev over docker
I put Thunderbrid in a Docker container for 2 reasons:
1) bypass version dependency on my system
2) Always copy the add-on to Zip (xpi) and then install it by hand.

These processes are very frustrating in the long run, especially if only one line in the code changes and this has to be checked. A day can quickly pass with this process.

## Docker
Now in docker you can set it up as follows:
File: ```docker-compose.yml``` and change the line:
```
- ./dist:/data/.thunderbird/1fwh53bl.default-release/extensions/FindNow@hw-softwareentwicklung.de/
```
Replaces the profile name ```1fwh53bl.default-release``` when it changes.

Now start the container:
``
docker-compose up
``

You can now access the Thunderbird via [http://localhost:8080](http://localhost:8080).

Changes to the code are now live in the Thunderbird container, just close Thunderbird in the interface and it will restart automatically after a few seconds.

## Grunt
Now i add Gruntfile, it has a build Task for creating ```Findnow.xpi```. 

Open the Terminal:
```shell script
grunt default
```

# 2. Thunderbird dev documentation links:

### start thunderbird with devtools
```
/thunderbird -devtools
```

### disable prompt dialog for debugger
```
devtools.debugger.prompt-connection
```
to ```false```


### migration strategy 
Link [https://developer.thunderbird.net/add-ons/updating/tb78#update-strategies](https://developer.thunderbird.net/add-ons/updating/tb78#update-strategies)
```
This guide covers the 'proper' migration strategy to convert a legacy add-on into a MailExtension. 
If you follow this strategy, you will end up with a future-proof MailExtension that will require 
substantially less maintenance work for future versions of Thunderbird.

This will be a complex task: almost all interactions with Thunderbird will need to be re-written 
to use the new APIs. If these APIs are not yet sufficient for your add-on, you may even need 
to implement additional APIs yourself. Don't worry though: you can find information on all 
aspects of the migration process below, including links to many advanced topics you may be 
interested in.
```

### How find current used Profile
1. Go in Help
2. Go to Information and Error...
3. Go "Profile" -> Open direktory


### setStringPref 0x8000ffff
Check your default variable type, a boolean can not save a string and except a 0x8000ffff error on component.

# Thunderbird Docs:
Info by: John Bieling (john@thunderbird.net)

> Thunderbird is currently transitioning to WebExtension APIs. 
> In the beginning of 2021 Firefox/MDN has pulled the plug and removed allmost all internal 
> documentation of XPCOM and friends, which would be relevant for legacy coding. 
> Your only resource for legacy coding now is the source:

[https://searchfox.org/](https://searchfox.org/)


> For the new WebExtension API approach we have put together a few resources:


[https://developer.thunderbird.net/add-ons/mailextensions](https://developer.thunderbird.net/add-ons/mailextensions)
[https://webextension-api.thunderbird.net/en/91/](https://webextension-api.thunderbird.net/en/91/)
[https://github.com/thundernest/sample-extensions](https://github.com/thundernest/sample-extensions)

> We also have active community channels:

[https://developer.thunderbird.net/add-ons/community](https://developer.thunderbird.net/add-ons/community)

> For transitioning add-ons, we have created a dedicatded repository:
    
[https://github.com/thundernest/addon-developer-support](https://github.com/thundernest/addon-developer-support)

> The mentioned wrapper APIs are no longer relevant to you, as you have manually switched 
> to an Experiment using similar techniques. But some of the auxiliary APIs could be of 
> interest for you (to not have to reinvent the wheel):

[https://github.com/thundernest/addon-developer-support/tree/master/auxiliary-apis](https://github.com/thundernest/addon-developer-support/tree/master/auxiliary-apis)

> Specifically the notifyTools API is a big helper to cross the boundary between legacy 
> coding and WebExtension coding. See also the update steps tutorials:
    
[https://github.com/thundernest/addon-developer-support/issues/37](https://github.com/thundernest/addon-developer-support/issues/37)

# Credits:
* John Bieling (john@thunderbird.net)
* ImportExportTools NG (https://github.com/thundernest/import-export-tools-ng)