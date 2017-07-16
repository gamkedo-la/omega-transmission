// SOUND SYSTEM MODULE
// by Christer "McFunkypants" Kaitila for http://gamkedo.com

// Requires https://github.com/goldfire/howler.js

"use strict";

const BACKGROUND_VOL = 0.7;

var Sound = new SoundSystem(); // global

function SoundSystem() {

    var USE_SOUND_ATLAS = false; // useful but optional
    var mute = false;   // if true ignore all play()
    var music = null;   // one looping Howl() object
    var sounds = [];    // an array of Howl() objects
    var atlas = null;   // one big sound sprite (optional)
    var debug_sound = false; // write to console?

    // playback function
    this.play = function(samplename,looping,vol,rate,pan)
    {
        // null variable conditions
        if (looping==null) looping = false;
        if (vol == null) vol = 1;
        if (rate == null) rate = 1;
        if (pan == null) pan = 0;

        //if (debug_sound) console.log("pan: " + pan);

        if (!sounds[samplename]) // downloads on demand once only
        {
            // src array is filenames to try in what order
            // every new browser supports .webm,
            // older ones like mp3 or ogg but not both
            if (debug_sound) console.log("Downloading a new sound: " + samplename);
            sounds[samplename] = new Howl({
                src: [
                    'audio/'+samplename+'.mp3',
                    'audio/'+samplename+'.ogg',
                    'audio/'+samplename+'.webm'],
                loop: looping,
                volume: vol,
                rate: rate,
                pan: pan
            });
        }
        if (!mute) // we still download even if muted
            sounds[samplename].play();

        //stops a sample from playing if it exists


        /*this.stopAll = function() {
            for(var snd in sounds){
                sounds[snd].stop();
            }//end new entry*/
        };

        this.stop = function(samplename) {
            if (debug_sound) console.log("soundSystem.stop "+samplename);
            if (sounds[samplename])
                sounds[samplename].stop();
        };

        this.pause = function(samplename) {
            if (debug_sound) console.log("soundSystem.stop "+samplename);
            if (sounds[samplename])
                sounds[samplename].pause();
        };




    function init()
    {
        // optionally we could use a sound atlas:
        // (tons of sounds in a single audio file)
        // so it downloads one mp3 file, not 25.
        // we define multiple "sound sprites" of our
        // samples which are spaced apart 1.2 seconds
        if (USE_SOUND_ATLAS)
        {
            /*
            atlas = new Howl({
            src: [
                'audio/squash-sound-atlas.ogg',
                'audio/squash-sound-atlas.mp3',
                'audio/squash-sound-atlas.webm'],
            pool:16, // how many concurrent sounds max
            volume:0.25, // quieter. (the range is 0 to 1)
            sprite: {
                // start, length in ms
                hit1: [1200*0, 1200],
                hit2: [1200*1, 1200],
                hit3: [1200*2, 1200],
                hit4: [1200*3, 1200],
                hit5: [1200*4, 1200],
                wall1: [1200*5, 1200],
                wall2: [1200*6, 1200],
                wall3: [1200*7, 1200],
                wall4: [1200*8, 1200],
                wall5: [1200*9, 1200],
                bounce1: [1200*10, 1200],
                bounce2: [1200*11, 1200],
                bounce3: [1200*12, 1200],
                bounce4: [1200*13, 1200],
                bounce5: [1200*14, 1200],
                shoe1: [1200*15, 1200],
                shoe2: [1200*16, 1200],
                shoe3: [1200*17, 1200],
                shoe4: [1200*18, 1200],
                shoe5: [1200*19, 1200],
                shoe6: [1200*20, 1200],
                shoe7: [1200*21, 1200],
                shoe8: [1200*22, 1200],
                shoe9: [1200*23, 1200],
                shoe10: [1200*24, 1200]
            }
        });
        */
        }

    }


    // returns true if a sample is currently playing
    this.isPlaying = function(samplename) {
        var result = false;

        if (sounds[samplename]) {
            result = sounds[samplename].playing();
        }
        else {
            if (debug_sound) console.log("unknown sound: " + samplename);
        }
        return result;
    };



    // inclusive: eg 1,10 may include 1 or 10
    function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

    // shortcuts for squash encounter. example:
    //Sound.hit(); // randomly play a hit sound
    //this.hit = function() { atlas.play('hit'+randomInt(1,5), false, 1, 1, -1); }
    //this.wall = function() { atlas.play('wall'+randomInt(1,5), false, 1, 1, -1); }
    //this.bounce = function() { atlas.play('bounce'+randomInt(1,5), false, 1, 1, -1); }
    //this.shoe = function() { atlas.play('shoe'+randomInt(1,10)); }

    this.Mute = function() {
        console.log("muting sound");
        Howler.mute(true);
    };

    this.unMute = function() {
        console.log("unmuting sound");
        Howler.mute(false);
    };

    init();

}
