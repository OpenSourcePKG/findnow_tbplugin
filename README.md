![Version](https://img.shields.io/badge/Version-4.2-blue)
[![License: GPL 3.0](https://img.shields.io/badge/License-GPL%203.0-red.png)](https://opensource.org/licenses/GPL-3.0)
![Tunderbird: 128.0 - 140.*](https://img.shields.io/badge/Thunderbird-128.0--140.*-brightgreen)
![Webpack](https://img.shields.io/badge/Webpack-yes-yellow)
![Grunt](https://img.shields.io/badge/Grunt-yes-yellow)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/OpenSourcePKG/findnow_tbplugin)

# FindNow Thunderbird Addon
<p align="center">
<img src="doc/images/tbfindnowlogo.png" width="300px" style="border-radius: 15px;transition: transform .2s;object-fit: cover;">
<br><br>
The FindNow plugin helps to store emails from Thunderbird in the file system as eml. These can then be scanned by FindNow.
</p>

* [FindNow on Addons.thunderbird.net](https://addons.thunderbird.net/addon/findnow/)
* [Click here to view this add-on’s version history](https://addons.thunderbird.net/addon/findnow/versions/).



# Maintainer
This is a project of Pegenau GmbH & Co. KG

https://www.pegenau.de/

### Version
* 128 - 140.*

# Developer environment
## Docker
```shell
docker-compose up
```
You can now access the Thunderbird via [http://localhost:8080](http://localhost:8080).

## NPM
First install all npm packets for grunt.
```shell
npm install
```

## Webpack
Webpack recreates the code with the typescript compiler and puts it together correctly.

## Grunt
Now I add Gruntfile, it has a build Task for creating ```Findnow.xpi```. 

Open the Terminal:
```shell
grunt default
```

# FAQ
### How find current used Profile
1. Go in Help
2. Go to Information and Error...
3. Go "Profile" -> Open direktory


### setStringPref 0x8000ffff
Check your default variable type, a boolean can not save a string and except a 0x8000ffff error on component.

# Contributors

Special thanks to the following contributors:

<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
	<tr>
		<td style="text-align: center;">
			<a href="https://github.com/Choppel">
				<img src="https://avatars.githubusercontent.com/u/14126324?v=4" width="80" alt=""/>
				<br /><sub><b>Choppel</b></sub>
			</a>
		</td>
		<td style="text-align: center;">
			<a href="https://github.com/jobisoft">
				<img src="https://avatars.githubusercontent.com/u/5830621?v=4" width="80" alt=""/>
				<br /><sub><b>John Bieling</b></sub>
			</a>
		</td>
		<td style="text-align: center;">
			<a href="https://github.com/arai-a">
				<img src="https://avatars.githubusercontent.com/u/6299746?v=4" width="80" alt=""/>
				<br /><sub><b>arai-a</b></sub>
			</a>
		</td>
	</tr>
</table>
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

# Credits:
* John Bieling (john@thunderbird.net)
* ImportExportTools NG (https://github.com/thundernest/import-export-tools-ng)
