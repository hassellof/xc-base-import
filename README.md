# xc-base-import

xc-base-import is a [Node.js](http://nodejs.org) tool that allows to import development language XLIFF files straight into the IB documents (storyboards and xibs).

# Discussion

In iOS7 Apple introduced so-called "Base localization" which allowed to keep the translation separate from the layout. With this approach you create storyboards and put the user-visible strings in the development language (usually English) straight into them. And when the time for the translation comes, you simply export an hand over to the translators a single XLIFF file, which, when imported, produces .strings files for the new language. This is extremely cool and I suggest every iOS developer to use it. ([More info](https://developer.apple.com/library/content/documentation/MacOSX/Conceptual/BPInternational/InternationalizingYourUserInterface/InternationalizingYourUserInterface.html))

But it soon turned out that this straightforward approach can only be used for the languages, different from the development one. If you want to change something in English, you still need to open the storyboard with Xcode and manually introduce the changes. Not that cool, huh?

If you decide to import a en-to-en XLIFF file, it produces a separate "en" localization, breaking the whole idea of Base localzation and also leading to a certain number of problems, which is out of scope of this document.

`xc-base-import` module allows to apply the XLIFF files straight to the IB documents, solving this problem. It also integrates nicely with the [PhraseApp](http://phraseapp.com/), which your localizers are very likely using. You just export an `en` localization file, put it into this tool and that's it!

What the tool does is it looks into the XLIFF file, finds all the entries, that correspond to storyboards and xibs and puts the values straight into these files.

# Installation

    $ npm install xc-base-import

# Usage

This tool has a simple command-line interface. You use it like this:

    xc-base-import -x /Users/superman/en.xliff  -p /Users/superman/MyProject

Call `xc-base-import --help` to find all the available parameters.

# Disclaimer

This is a BETA tool, so use it at your own risk. Support with the development is highly appreciated until we get the official support for this from Apple =]

I'm an iOS developer and sort of new to Node.js, so the code may not follow any of the existing guidelines or best practices, feel free to send pull requests, I will most likely accept it.

# Known issues

- Currently only XLIFF files with the `source-language` and `target-language` of `en` work.
- The tool is using [elementtree](https://www.npmjs.com/package/elementtree) for XML parsing, and it handles things a bit different from Xcode, so after you apply the tool most likely all the interface files will be changed (not broken though). Take it into consideration when working in a team as it may lead to a bad headache and deep frustration when merging.

# Credits

Daniil Konoplev @ [Ombori Group AB 2017](https://ombori.com/)
