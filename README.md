Sizer
=====

Scale image by clicking on it to real image size or to window size

##Usage

Just call `sizer` function with source image element and options (optional) as params. 

```javascript
sizer(source,options)
```

###Params

* padding - padding from window in percents (default is 5)
* closeOnScroll - will close overlay by scroll event (default is false)

To remove functional just call `removeSizer` of source element