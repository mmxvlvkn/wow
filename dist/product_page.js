function _typeof(obj){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&"function"==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj},_typeof(obj)}function _regeneratorRuntime(){"use strict";/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */_regeneratorRuntime=function _regeneratorRuntime(){return exports};var exports={},Op=Object.prototype,hasOwn=Op.hasOwnProperty,$Symbol="function"==typeof Symbol?Symbol:{},iteratorSymbol=$Symbol.iterator||"@@iterator",asyncIteratorSymbol=$Symbol.asyncIterator||"@@asyncIterator",toStringTagSymbol=$Symbol.toStringTag||"@@toStringTag";function define(obj,key,value){return Object.defineProperty(obj,key,{value:value,enumerable:!0,configurable:!0,writable:!0}),obj[key]}try{define({},"")}catch(err){define=function define(obj,key,value){return obj[key]=value}}function wrap(innerFn,outerFn,self,tryLocsList){var protoGenerator=outerFn&&outerFn.prototype instanceof Generator?outerFn:Generator,generator=Object.create(protoGenerator.prototype),context=new Context(tryLocsList||[]);return generator._invoke=function(innerFn,self,context){var state="suspendedStart";return function(method,arg){if("executing"===state)throw new Error("Generator is already running");if("completed"===state){if("throw"===method)throw arg;return doneResult()}for(context.method=method,context.arg=arg;;){var delegate=context.delegate;if(delegate){var delegateResult=maybeInvokeDelegate(delegate,context);if(delegateResult){if(delegateResult===ContinueSentinel)continue;return delegateResult}}if("next"===context.method)context.sent=context._sent=context.arg;else if("throw"===context.method){if("suspendedStart"===state)throw state="completed",context.arg;context.dispatchException(context.arg)}else"return"===context.method&&context.abrupt("return",context.arg);state="executing";var record=tryCatch(innerFn,self,context);if("normal"===record.type){if(state=context.done?"completed":"suspendedYield",record.arg===ContinueSentinel)continue;return{value:record.arg,done:context.done}}"throw"===record.type&&(state="completed",context.method="throw",context.arg=record.arg)}}}(innerFn,self,context),generator}function tryCatch(fn,obj,arg){try{return{type:"normal",arg:fn.call(obj,arg)}}catch(err){return{type:"throw",arg:err}}}exports.wrap=wrap;var ContinueSentinel={};function Generator(){}function GeneratorFunction(){}function GeneratorFunctionPrototype(){}var IteratorPrototype={};define(IteratorPrototype,iteratorSymbol,function(){return this});var getProto=Object.getPrototypeOf,NativeIteratorPrototype=getProto&&getProto(getProto(values([])));NativeIteratorPrototype&&NativeIteratorPrototype!==Op&&hasOwn.call(NativeIteratorPrototype,iteratorSymbol)&&(IteratorPrototype=NativeIteratorPrototype);var Gp=GeneratorFunctionPrototype.prototype=Generator.prototype=Object.create(IteratorPrototype);function defineIteratorMethods(prototype){["next","throw","return"].forEach(function(method){define(prototype,method,function(arg){return this._invoke(method,arg)})})}function AsyncIterator(generator,PromiseImpl){function invoke(method,arg,resolve,reject){var record=tryCatch(generator[method],generator,arg);if("throw"!==record.type){var result=record.arg,value=result.value;return value&&"object"==_typeof(value)&&hasOwn.call(value,"__await")?PromiseImpl.resolve(value.__await).then(function(value){invoke("next",value,resolve,reject)},function(err){invoke("throw",err,resolve,reject)}):PromiseImpl.resolve(value).then(function(unwrapped){result.value=unwrapped,resolve(result)},function(error){return invoke("throw",error,resolve,reject)})}reject(record.arg)}var previousPromise;this._invoke=function(method,arg){function callInvokeWithMethodAndArg(){return new PromiseImpl(function(resolve,reject){invoke(method,arg,resolve,reject)})}return previousPromise=previousPromise?previousPromise.then(callInvokeWithMethodAndArg,callInvokeWithMethodAndArg):callInvokeWithMethodAndArg()}}function maybeInvokeDelegate(delegate,context){var method=delegate.iterator[context.method];if(undefined===method){if(context.delegate=null,"throw"===context.method){if(delegate.iterator.return&&(context.method="return",context.arg=undefined,maybeInvokeDelegate(delegate,context),"throw"===context.method))return ContinueSentinel;context.method="throw",context.arg=new TypeError("The iterator does not provide a 'throw' method")}return ContinueSentinel}var record=tryCatch(method,delegate.iterator,context.arg);if("throw"===record.type)return context.method="throw",context.arg=record.arg,context.delegate=null,ContinueSentinel;var info=record.arg;return info?info.done?(context[delegate.resultName]=info.value,context.next=delegate.nextLoc,"return"!==context.method&&(context.method="next",context.arg=undefined),context.delegate=null,ContinueSentinel):info:(context.method="throw",context.arg=new TypeError("iterator result is not an object"),context.delegate=null,ContinueSentinel)}function pushTryEntry(locs){var entry={tryLoc:locs[0]};1 in locs&&(entry.catchLoc=locs[1]),2 in locs&&(entry.finallyLoc=locs[2],entry.afterLoc=locs[3]),this.tryEntries.push(entry)}function resetTryEntry(entry){var record=entry.completion||{};record.type="normal",delete record.arg,entry.completion=record}function Context(tryLocsList){this.tryEntries=[{tryLoc:"root"}],tryLocsList.forEach(pushTryEntry,this),this.reset(!0)}function values(iterable){if(iterable){var iteratorMethod=iterable[iteratorSymbol];if(iteratorMethod)return iteratorMethod.call(iterable);if("function"==typeof iterable.next)return iterable;if(!isNaN(iterable.length)){var i=-1,next=function next(){for(;++i<iterable.length;){if(hasOwn.call(iterable,i))return next.value=iterable[i],next.done=!1,next}return next.value=undefined,next.done=!0,next};return next.next=next}}return{next:doneResult}}function doneResult(){return{value:undefined,done:!0}}return GeneratorFunction.prototype=GeneratorFunctionPrototype,define(Gp,"constructor",GeneratorFunctionPrototype),define(GeneratorFunctionPrototype,"constructor",GeneratorFunction),GeneratorFunction.displayName=define(GeneratorFunctionPrototype,toStringTagSymbol,"GeneratorFunction"),exports.isGeneratorFunction=function(genFun){var ctor="function"==typeof genFun&&genFun.constructor;return!!ctor&&(ctor===GeneratorFunction||"GeneratorFunction"===(ctor.displayName||ctor.name))},exports.mark=function(genFun){return Object.setPrototypeOf?Object.setPrototypeOf(genFun,GeneratorFunctionPrototype):(genFun.__proto__=GeneratorFunctionPrototype,define(genFun,toStringTagSymbol,"GeneratorFunction")),genFun.prototype=Object.create(Gp),genFun},exports.awrap=function(arg){return{__await:arg}},defineIteratorMethods(AsyncIterator.prototype),define(AsyncIterator.prototype,asyncIteratorSymbol,function(){return this}),exports.AsyncIterator=AsyncIterator,exports.async=function(innerFn,outerFn,self,tryLocsList,PromiseImpl){void 0===PromiseImpl&&(PromiseImpl=Promise);var iter=new AsyncIterator(wrap(innerFn,outerFn,self,tryLocsList),PromiseImpl);return exports.isGeneratorFunction(outerFn)?iter:iter.next().then(function(result){return result.done?result.value:iter.next()})},defineIteratorMethods(Gp),define(Gp,toStringTagSymbol,"Generator"),define(Gp,iteratorSymbol,function(){return this}),define(Gp,"toString",function(){return"[object Generator]"}),exports.keys=function(object){var keys=[];for(var key in object){keys.push(key)}return keys.reverse(),function next(){for(;keys.length;){var key=keys.pop();if(key in object)return next.value=key,next.done=!1,next}return next.done=!0,next}},exports.values=values,Context.prototype={constructor:Context,reset:function reset(skipTempReset){if(this.prev=0,this.next=0,this.sent=this._sent=undefined,this.done=!1,this.delegate=null,this.method="next",this.arg=undefined,this.tryEntries.forEach(resetTryEntry),!skipTempReset)for(var name in this){"t"===name.charAt(0)&&hasOwn.call(this,name)&&!isNaN(+name.slice(1))&&(this[name]=undefined)}},stop:function stop(){this.done=!0;var rootRecord=this.tryEntries[0].completion;if("throw"===rootRecord.type)throw rootRecord.arg;return this.rval},dispatchException:function dispatchException(exception){if(this.done)throw exception;var context=this;function handle(loc,caught){return record.type="throw",record.arg=exception,context.next=loc,caught&&(context.method="next",context.arg=undefined),!!caught}for(var i=this.tryEntries.length-1;i>=0;--i){var entry=this.tryEntries[i],record=entry.completion;if("root"===entry.tryLoc)return handle("end");if(entry.tryLoc<=this.prev){var hasCatch=hasOwn.call(entry,"catchLoc"),hasFinally=hasOwn.call(entry,"finallyLoc");if(hasCatch&&hasFinally){if(this.prev<entry.catchLoc)return handle(entry.catchLoc,!0);if(this.prev<entry.finallyLoc)return handle(entry.finallyLoc)}else if(hasCatch){if(this.prev<entry.catchLoc)return handle(entry.catchLoc,!0)}else{if(!hasFinally)throw new Error("try statement without catch or finally");if(this.prev<entry.finallyLoc)return handle(entry.finallyLoc)}}}},abrupt:function abrupt(type,arg){for(var i=this.tryEntries.length-1;i>=0;--i){var entry=this.tryEntries[i];if(entry.tryLoc<=this.prev&&hasOwn.call(entry,"finallyLoc")&&this.prev<entry.finallyLoc){var finallyEntry=entry;break}}finallyEntry&&("break"===type||"continue"===type)&&finallyEntry.tryLoc<=arg&&arg<=finallyEntry.finallyLoc&&(finallyEntry=null);var record=finallyEntry?finallyEntry.completion:{};return record.type=type,record.arg=arg,finallyEntry?(this.method="next",this.next=finallyEntry.finallyLoc,ContinueSentinel):this.complete(record)},complete:function complete(record,afterLoc){if("throw"===record.type)throw record.arg;return"break"===record.type||"continue"===record.type?this.next=record.arg:"return"===record.type?(this.rval=this.arg=record.arg,this.method="return",this.next="end"):"normal"===record.type&&afterLoc&&(this.next=afterLoc),ContinueSentinel},finish:function finish(finallyLoc){for(var i=this.tryEntries.length-1;i>=0;--i){var entry=this.tryEntries[i];if(entry.finallyLoc===finallyLoc)return this.complete(entry.completion,entry.afterLoc),resetTryEntry(entry),ContinueSentinel}},catch:function _catch(tryLoc){for(var i=this.tryEntries.length-1;i>=0;--i){var entry=this.tryEntries[i];if(entry.tryLoc===tryLoc){var record=entry.completion;if("throw"===record.type){var thrown=record.arg;resetTryEntry(entry)}return thrown}}throw new Error("illegal catch attempt")},delegateYield:function delegateYield(iterable,resultName,nextLoc){return this.delegate={iterator:values(iterable),resultName:resultName,nextLoc:nextLoc},"next"===this.method&&(this.arg=undefined),ContinueSentinel}},exports}function asyncGeneratorStep(gen,resolve,reject,_next,_throw,key,arg){try{var info=gen[key](arg);var value=info.value}catch(error){reject(error);return}if(info.done){resolve(value)}else{Promise.resolve(value).then(_next,_throw)}}function _asyncToGenerator(fn){return function(){var self=this,args=arguments;return new Promise(function(resolve,reject){var gen=fn.apply(self,args);function _next(value){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"next",value)}function _throw(err){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"throw",err)}_next(undefined)})}}// PRODUCT_PAGE
// Set min width for product page description
var $productPage=$body.querySelector(".produst-page");var $productPageDescription=$body.querySelector(".produst-page__description");$productPageDescription.style.minHeight="".concat(window.innerHeight-parseInt(window.getComputedStyle($body.querySelector("header")).height)-parseInt(window.getComputedStyle($productPage).paddingTop),"px");// PRODUCT SETTINGS
// Set width for product settings container
var $productSettings=$body.querySelector(".product-settings");var $productSettingsContainer=$productSettings.querySelector(".product-settings__container");var productSettingsVerticalPadding=10;if(document.documentElement.clientWidth>800){$productSettingsContainer.style.height="".concat(document.documentElement.clientHeight-parseInt(window.getComputedStyle($body.querySelector("header")).height)-parseInt(window.getComputedStyle($productPage).paddingTop)-productSettingsVerticalPadding*2,"px")}// Set position for product settings container
var baseTopForDescription=parseInt(window.getComputedStyle($body.querySelector("header")).height)+parseInt(window.getComputedStyle($productPage).paddingTop);var baseTopForProductSettingsContainer=baseTopForDescription+productSettingsVerticalPadding;var $produstPageDescription=$productPage.querySelector(".produst-page__description");if(window.clientWidth>800){if(window.scrollY>=baseTopForDescription+$produstPageDescription.clientHeight-window.innerHeight){setPositionToEnd()}else{setPositionToStart()}}window.addEventListener("scroll",function(){if(window.innerWidth>800){if(window.scrollY>=baseTopForDescription+$produstPageDescription.clientHeight-window.innerHeight){setPositionToEnd()}else{setPositionToStart()}}});function setPositionToStart(){$productSettingsContainer.style.top="".concat(baseTopForProductSettingsContainer,"px");parseFloat(window.getComputedStyle($productPageDescription).border.split(" ")[0]);$productSettingsContainer.style.left="".concat($productPageDescription.getBoundingClientRect().left+$productPageDescription.clientWidth+parseFloat(window.getComputedStyle($productPageDescription).border.split(" ")[0])*2,"px");$productSettingsContainer.style.position="fixed"}function setPositionToEnd(){$productSettingsContainer.style.position="relative";$productSettingsContainer.style.left="0px";$productSettingsContainer.style.top="".concat(baseTopForDescription+$produstPageDescription.clientHeight-$productSettingsContainer.clientHeight-productSettingsVerticalPadding-baseTopForProductSettingsContainer,"px")}// Run radiobuttons
$body.querySelectorAll(".product-settings__radiobutton").forEach(function($item){$item.addEventListener("click",runRadiobutton)});function runRadiobutton(event){var $target=event.target.closest(".product-settings__radiobutton");var $parent=$target.parentNode;$parent.querySelectorAll(".product-settings__radiobutton").forEach(function($item){if($item.classList.contains("_checked")){$item.classList.remove("_checked");$item.setAttribute("data-status","off")}});$target.classList.add("_checked");$target.setAttribute("data-status","on")}// Run slider range
var $optionsRange=$body.querySelectorAll(".product-settings__option.range");var priceGaps=[1];var _loop=function _loop(i){var $progress=$optionsRange[i].querySelector(".product-settings__range-progress");var $inputsForRange=$optionsRange[i].querySelectorAll(".product-settings__input-for-range");var $ranges=$optionsRange[i].querySelectorAll(".product-settings__range");// Run input for slider range
$inputsForRange.forEach(function($inputForRange){$inputForRange.addEventListener("input",function(event){var min=$ranges[0].getAttribute("min");var max=$ranges[0].getAttribute("max");var minVal=$inputsForRange[0].value&&$inputsForRange[0].value>=0?parseInt($inputsForRange[0].value):0;var maxVal=$inputsForRange[1].value&&$inputsForRange[0].value>=0?parseInt($inputsForRange[1].value):0;if(maxVal-minVal>=priceGaps[i]&&maxVal<=max){if(event.target.classList.contains("product-settings__input-for-range-min")){$ranges[0].value=minVal;$progress.style.left="".concat(minVal/max*100,"%")}else{$ranges[1].value=maxVal;$progress.style.right="".concat(100-maxVal/max*100,"%")}}})});// Run slider range
$ranges.forEach(function($inputForRange){$inputForRange.addEventListener("input",function(event){var min=$ranges[0].getAttribute("min");var max=$ranges[0].getAttribute("max");var minVal=parseInt($ranges[0].value);var maxVal=parseInt($ranges[1].value);if(maxVal-minVal<priceGaps[i]){if(event.target.classList.contains("product-settings__range-min")){$ranges[0].value=maxVal-priceGaps[i]}else{$ranges[1].value=minVal+priceGaps[i]}}else{$inputsForRange[0].value=minVal;$inputsForRange[1].value=maxVal;$progress.style.left="".concat(minVal/max*100,"%");$progress.style.right="".concat(100-maxVal/max*100,"%")}})})};for(var i=0;i<$optionsRange.length;i++){_loop(i)}// Adoptive
var windowWidth=document.documentElement.clientWidth;var windowHeight=window.innerHeight;var adobtiveStatus="null";window.addEventListener("resize",function(){// Width adoptive
baseTopForDescription=parseInt(window.getComputedStyle($body.querySelector("header")).height)+parseInt(window.getComputedStyle($productPage).paddingTop);baseTopForProductSettingsContainer=baseTopForDescription+productSettingsVerticalPadding;if(document.documentElement.clientWidth>800){$productSettingsContainer.style.left="".concat($productPageDescription.getBoundingClientRect().left+$productPageDescription.clientWidth+4,"px");$productSettingsContainer.style.height="".concat(document.documentElement.clientHeight-parseInt(window.getComputedStyle($body.querySelector("header")).height)-parseInt(window.getComputedStyle($productPage).paddingTop)-productSettingsVerticalPadding*2,"px");if(window.scrollY>=baseTopForDescription+$produstPageDescription.clientHeight-window.innerHeight){setPositionToEnd()}else{setPositionToStart()}if(adobtiveStatus!=="more"){adobtiveStatus="more"}}else if(adobtiveStatus!=="less"){$productSettingsContainer.style.height="auto";$productSettingsContainer.style.position="relative";$productSettingsContainer.style.left="0px";$productSettingsContainer.style.top="0px";adobtiveStatus="less"}});// Price formation
var orderDescription;var dataForPriceFormation={base_price:8.5,radio:{region:{eu:{is_coef:true,value:1},us:{is_coef:true,value:1.2}},faction:{horde:{is_coef:true,value:1},alliance:{is_coef:true,value:1}},boost_method:{self_play:{is_coef:true,value:1},piloted:{is_coef:true,value:1.06},remote_control:{is_coef:true,value:1}},execution_options:{normal:{is_coef:true,value:1},extra_fast:{is_coef:false,value:8.28},faster_25:{is_coef:false,value:3.31},faster_50:{is_coef:false,value:5.8}}},range:{levels:{is_coef:false,value:0.74}},checkbox:{additional_options:{additional_options_1:{is_coef:false,value:18.15},additional_options_2:{is_coef:false,value:40.59},additional_options_3:{is_coef:false,value:45.93},additional_options_4:{is_coef:false,value:32.04}}},select:{multiple_character_leveling:{characters_1:{is_coef:false,value:0},characters_2:{is_coef:false,value:15.12},characters_3:{is_coef:false,value:29.43},characters_4:{is_coef:false,value:43.24},characters_5:{is_coef:false,value:56.71},characters_6:{is_coef:false,value:68.71}}}};var $productPricesEn=$body.querySelectorAll(".product-price__price .en .product-price__text");var $productPricesRu=$body.querySelectorAll(".product-price__price .ru .product-price__text");var $radios=$body.querySelectorAll(".product-settings__option.radio");var $ranges=$body.querySelectorAll(".product-settings__option.range");var $checkboxes=$body.querySelectorAll(".product-settings__option.checkbox");var $selects=$body.querySelectorAll(".product-settings__option.select");var price=dataForPriceFormation.base_price;var coef=1;priceFormation();$radios.forEach(function($radio){$radio.querySelectorAll(".product-settings__radiobutton").forEach(function($radioItem){$radioItem.addEventListener("click",function(){priceFormation()})})});$ranges.forEach(function($range){$range.querySelectorAll("input").forEach(function($rangeItem){$rangeItem.addEventListener("input",function(){priceFormation()})})});$checkboxes.forEach(function($checkbox){$checkbox.querySelectorAll(".product-settings__checkbox").forEach(function($checkboxItem){$checkboxItem.addEventListener("input",function(){priceFormation()})})});$selects.forEach(function($select){$select.querySelector(".product-settings__select").addEventListener("input",function(){priceFormation()})});function priceFormation(){orderDescription="";price=dataForPriceFormation.base_price;coef=1;orderDescription+="radio:\n";$radios.forEach(function($radio){$checked=$radio.querySelector("._checked");var data=dataForPriceFormation.radio[$checked.getAttribute("name")][$checked.getAttribute("value")];orderDescription+="  ".concat($checked.getAttribute("name"),":\n");orderDescription+="    ".concat($checked.getAttribute("value"),":\n");if(data.is_coef){coef*=data.value}else{price+=data.value}});orderDescription+="range:\n";$ranges.forEach(function($range){var delta=$range.querySelector(".product-settings__input-for-range-max").value-$range.querySelector(".product-settings__input-for-range-min").value;var maxDelta=$range.querySelector(".product-settings__range-min").getAttribute("max")-$range.querySelector(".product-settings__range-min").getAttribute("min");orderDescription+="  ".concat($range.querySelector(".product-settings__input-for-range-min").getAttribute("name"),":\n");orderDescription+="    ".concat($range.querySelector(".product-settings__range-min").getAttribute("min")," - ").concat($range.querySelector(".product-settings__range-min").getAttribute("max"),"\n");if(dataForPriceFormation.range[$range.querySelector(".product-settings__input-for-range-min").getAttribute("name")].is_coef){if(delta>=1&&delta<=maxDelta){coef*=delta*dataForPriceFormation.range[$range.querySelector(".product-settings__input-for-range-min").getAttribute("name")].value}}else{if(delta>=1&&delta<=maxDelta){price+=delta*dataForPriceFormation.range[$range.querySelector(".product-settings__input-for-range-min").getAttribute("name")].value}}});orderDescription+="checkbox:\n";$checkboxes.forEach(function($checkbox){var tempTitle="";var tempSubtitle="";$checkbox.querySelectorAll(".product-settings__checkbox").forEach(function($checkboxItem){if($checkboxItem.checked){tempTitle="  "+String($checkboxItem.getAttribute("data-checkbox-name"))+"\n";tempSubtitle+="    "+String($checkboxItem.getAttribute("name"))+"\n";if(dataForPriceFormation.checkbox[$checkboxItem.getAttribute("data-checkbox-name")][$checkboxItem.getAttribute("name")].is_coef){coef*=dataForPriceFormation.checkbox[$checkboxItem.getAttribute("data-checkbox-name")][$checkboxItem.getAttribute("name")].value}else{price+=dataForPriceFormation.checkbox[$checkboxItem.getAttribute("data-checkbox-name")][$checkboxItem.getAttribute("name")].value}}});orderDescription+=tempTitle;orderDescription+=tempSubtitle});orderDescription+="select:\n";$selects.forEach(function($select){var $selectItem=$select.querySelector(".product-settings__select");orderDescription+="  ".concat($selectItem.getAttribute("name"),":\n");orderDescription+="    ".concat($selectItem.value,":\n");if(dataForPriceFormation.select[$selectItem.getAttribute("name")][$selectItem.value]){if(dataForPriceFormation.select[$selectItem.getAttribute("name")][$selectItem.value].is_coef){coef*=dataForPriceFormation.select[$selectItem.getAttribute("name")][$selectItem.value].value}else{price+=dataForPriceFormation.select[$selectItem.getAttribute("name")][$selectItem.value].value}}});price*=coef;$productPricesEn[0].textContent=price.toFixed(2);$productPricesEn[1].textContent=price.toFixed(2);$productPricesRu[0].textContent=(price*76).toFixed(2);$productPricesRu[1].textContent=(price*76).toFixed(2)}// Submit and payment
var $form=$body.querySelector(".product-settings__form");$form.addEventListener("submit",function(event){event.preventDefault();if(localStorage.getItem("isLoggedIn")==="true"){checkToken().then(function(checkTokenResult){if(checkTokenResult){//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
fetch("".concat(HOST,"/api/send_email_code"),{method:"POST",credentials:"include",body:JSON.stringify({price:price,description:orderDescription}),headers:{"Content-Type":"application/json"}}).then(/*#__PURE__*/function(){var _ref=_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(res){var status,data;return _regeneratorRuntime().wrap(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:status=res.status;_context.next=3;return res.json();case 3:data=_context.sent;if(status!==200){}else{}case 5:case"end":return _context.stop();}}},_callee)}));return function(_x){return _ref.apply(this,arguments)}}()).catch(function(error){$headerSignUpErrorMessage.textContent=currentLanguage==="en"?"Unexpected error":"\u041D\u0435\u043F\u0440\u0435\u0434\u0432\u0438\u0434\u0435\u043D\u043D\u0430\u044F \u043E\u0448\u0438\u0431\u043A\u0430";console.error("Fetch error")})}else{doExit();if(!$headerLogInPopup.classList.contains("_shown")){$headerLogInPopup.classList.add("_shown");$body.classList.add("_lock")}}})}else{if(!$headerLogInPopup.classList.contains("_shown")){$headerLogInPopup.classList.add("_shown");$body.classList.add("_lock")}}});// REVIEW 
//Review slider
var $content=$body.querySelector(".content");var $reviewContentContainer=$body.querySelector(".reviews__content-container");var $reviewsArray=$reviewContentContainer.querySelectorAll(".review");var countReview=$reviewsArray.length;var contentWidth=$content.clientWidth-30;var reviewWidth=$reviewsArray[0].clientWidth;var countReviewInContainer=contentWidth%reviewWidth/(Math.floor(contentWidth/reviewWidth)-1)>=10?Math.floor(contentWidth/reviewWidth):Math.floor(contentWidth/reviewWidth)-1;var reviewGap=(contentWidth-reviewWidth*countReviewInContainer)/(countReviewInContainer-1)<25?(contentWidth-reviewWidth*countReviewInContainer)/(countReviewInContainer-1):25;var sidePadding=(contentWidth-(countReviewInContainer*reviewWidth+reviewGap*(countReviewInContainer-1)))/2;$reviewContentContainer.style.width="".concat(contentWidth-sidePadding*2>contentWidth?contentWidth:contentWidth-sidePadding*2,"px");$reviewContentContainer.style.height="".concat($reviewsArray[0].clientHeight,"px");$reviewsArray[0].style.left="-".concat(reviewWidth+reviewGap,"px");$reviewsArray[1].style.left="".concat(0,"px");for(var _i=0;_i<countReviewInContainer-1;_i++){$reviewsArray[_i+2].style.left="".concat((reviewWidth+reviewGap)*(_i+1),"px")}for(var _i2=0;_i2<countReview-countReviewInContainer-1;_i2++){$reviewsArray[countReviewInContainer+_i2+1].style.left="".concat((reviewWidth+reviewGap)*countReviewInContainer,"px")}window.addEventListener("resize",function(){setTimeout(function(){contentWidth=$content.clientWidth-30;reviewWidth=$reviewsArray[0].clientWidth;countReviewInContainer=contentWidth%reviewWidth/(Math.floor(contentWidth/reviewWidth)-1)>=10?Math.floor(contentWidth/reviewWidth):Math.floor(contentWidth/reviewWidth)-1;reviewGap=(contentWidth-reviewWidth*countReviewInContainer)/(countReviewInContainer-1)<25?(contentWidth-reviewWidth*countReviewInContainer)/(countReviewInContainer-1):25;sidePadding=(contentWidth-(countReviewInContainer*reviewWidth+reviewGap*(countReviewInContainer-1)))/2;$reviewContentContainer.style.width="".concat(contentWidth-sidePadding*2>contentWidth?contentWidth:contentWidth-sidePadding*2,"px");$reviewContentContainer.style.height="".concat($reviewsArray[0].clientHeight,"px");$reviewsArray[0].style.left="-".concat(reviewWidth+reviewGap,"px");$reviewsArray[1].style.left="".concat(0,"px");for(var _i3=0;_i3<countReviewInContainer-1;_i3++){$reviewsArray[_i3+2].style.left="".concat((reviewWidth+reviewGap)*(_i3+1),"px")}for(var _i4=0;_i4<countReview-countReviewInContainer-1;_i4++){$reviewsArray[countReviewInContainer+_i4+1].style.left="".concat((reviewWidth+reviewGap)*countReviewInContainer,"px")}},500)});setInterval(slide,5000);function slide(){for(var _i5=0;_i5<countReviewInContainer+1;_i5++){$reviewsArray[_i5+1].style.left="".concat(parseInt($reviewsArray[_i5+1].style.left)-(reviewWidth+reviewGap),"px")}$reviewsArray[0].style.left="".concat((reviewWidth+reviewGap)*countReviewInContainer,"px");$reviewContentContainer.append($reviewsArray[0]);$reviewsArray=$reviewContentContainer.querySelectorAll(".review")}