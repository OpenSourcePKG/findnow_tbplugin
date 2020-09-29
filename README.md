# findnow_tbplugin
## Generals
* Version: ```78.1```
* Project: ```Findnow TB for Version 78 Thunderbird```
* Author: ```Stefan Werfling```
* Lang: ```js, ts```
* Tools: ```phpstorm```
* Last update: ```26.09.2020```

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

