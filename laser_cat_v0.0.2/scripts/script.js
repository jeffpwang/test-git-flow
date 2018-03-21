/*
Copyright 2017-present, Facebook, Inc.
All rights reserved.

You are hereby granted a non-exclusive, worldwide, royalty-free license to use,
copy, modify, and distribute this software in source code or binary form for use
in connection with the web services and APIs provided by Facebook.

As with any software that integrates with the Facebook platform, your use of
this software is subject to the Facebook Platform Policy
[http://developers.facebook.com/policy/]. This copyright notice shall be
included in all copies or substantial portions of the software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// Get references to required Modules
const Scene = require('Scene');
const Animation = require('Animation');
const Materials = require('Materials');
const Textures = require('Textures');
const FaceTracking = require('FaceTracking');
const Diagnostics = require('Diagnostics');

// Get references to face, objects, materials and textures
const face = FaceTracking.face(0);
const laserRight = Scene.root.find('laser_beam_r');
const laserLeft = Scene.root.find('laser_beam_l');
const laserMat = Materials.get("lasers_mat");
const topUFOSequence = Textures.get("top_ufo_sequence");
const bottomUFOSequence = Textures.get("bottom_ufo_sequence");

// Drive laser opacity and scale using mouth openness
const mouthDriver = Animation.valueDriver(face.mouth.openness, 0.2, 0.4);
const laserScaleSampler = Animation.samplers.linear(0.1, 1);
const laserScaleAnimation = Animation.animate(mouthDriver, laserScaleSampler).expSmooth(100);
laserLeft.transform.scaleX = laserScaleAnimation.mul(5);
laserLeft.transform.scaleY = laserScaleAnimation;
laserLeft.transform.scaleZ = laserScaleAnimation;
laserRight.transform.scaleX = laserScaleAnimation.mul(5);
laserRight.transform.scaleY = laserScaleAnimation;
laserRight.transform.scaleZ = laserScaleAnimation;
const laserOpacitySampler = Animation.samplers.linear(0, 1);
const laserOpacityAnimation = Animation.animate(mouthDriver, laserOpacitySampler).expSmooth(100);
laserMat.opacity = laserOpacityAnimation;

// Drive UFO sequence frames using looped animation
const ufoSequenceFrameDriver = Animation.loopTimeDriver(6000);
const ufoSequenceFrameSampler = Animation.samplers.sequence(
		{ 
			samplers: [ 
				Animation.samplers.linear(0, 15),
				Animation.samplers.linear(15, 15),
				Animation.samplers.linear(15, 0),
				Animation.samplers.linear(0, 0)
			],
			knots: [ 0, 1, 5, 6, 7]
		});
const ufoSequenceFrameAnimation = Animation.animate(ufoSequenceFrameDriver, ufoSequenceFrameSampler);
topUFOSequence.currentFrame = ufoSequenceFrameAnimation;
bottomUFOSequence.currentFrame = ufoSequenceFrameAnimation;
ufoSequenceFrameDriver.start();
