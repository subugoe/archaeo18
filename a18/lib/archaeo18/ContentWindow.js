/**
* content window (==folder) to show documents
*/
ContentWindow = function(){
		
		this.nameId;
		this.index = -1;
		this.documents = [];
		this.documentDialogs = [];
		this.tabData = [];
		this.selection = 0;

		/**
		* sets label for folder
		*/
		this.setLabel = function(title){
			$(this.label).html(title);
		};

		/**
		* initializes folder
		*/
		this.initializeContentWindow = function(index){
			this.index = index;
			this.tabs = $("<ul class='tabs'/>").appendTo(this.content);
			this.documentDiv = $("<div class='inner'/>").appendTo(this.content);
			this.nameId = index;
			this.setLabel(this.getName());
		};
		
		/**
		* updates name after other folder was removed
		*/
		this.updateName = function(index){
			if( this.nameId != index ){
				this.nameId = index;
				this.setLabel(this.getName());
			}
		};
		
		/**
		* returns name of folder
		*/
		this.getName = function(){
			return Util.getString('contentWindow')+" #"+this.nameId;
		};

		/**
		* resizes folder and all document contents
		*/
		this.resizeContent = function(){
			var cw = this;
			var padding = parseInt($(cw.documentDiv).css("padding-bottom"))+parseInt($(cw.documentDiv).css("padding-top"));
			$(this.documentDiv).css('height',(this.content.height()-this.tabs.height()-padding)+'px');
			var padding = parseInt($(cw.documentDiv).css("padding-bottom"))+parseInt($(cw.documentDiv).css("padding-top"));
			$.each(this.tabData,function(i,div){
				div.tabDiv.css('height',(cw.content.height()-cw.tabs.height()-padding)+'px');
			});
			$.each(this.documentDialogs,function(i,dialog){
				dialog.resize();
			});
		};

		/**
		* returns dialog of actual selected tab
		*/
		this.dialog = function(){
			if( this.documentDialogs.length > 0 ){
				return this.documentDialogs[ this.selection ];
			}
			return null;
		};
		
		/**
		* selects a <tab> (is an index or a tab json definition)
		*/
		this.selectTab = function(tab){
			if( typeof tab.tab != 'undefined' ){
				for( var i in this.tabData ){
					if( this.tabData[i] != tab ){
						$(this.tabData[i].tabDiv).css('display','none');
						$(this.tabData[i].tab).removeClass('selected');
					}
					else {
						this.selection = i;
						$(this.tabData[i].tabDiv).css('display','block');
						$(this.tabData[i].tab).addClass('selected');
					}
				}
			}
			else if( tab < this.tabData.length ){
				this.selection = tab;
				for( var i=0; i<this.tabData.length; i++ ){
					$(this.tabData[i].tabDiv).css('display','none');
					$(this.tabData[i].tab).removeClass('selected');
				}
				$(this.tabData[tab].tabDiv).css('display','block');
				$(this.tabData[tab].tab).addClass('selected');
			}
		};

		/**
		* adds a new tab for a given <document> optionally <page>, <type> and <position> (in fulltext)
		*/
		this.addTab = function(document,page,type,position){
			var container = this;
			this.documents.push(document);
			var tab = $("<li/>").appendTo(this.tabs);
			var tabLink = $("<a>"+document.title+"</a>").appendTo(tab);
			var tabClose = $("<img src='img/edition-window-tab-close-active.png'/>").appendTo(tab);
			var tabDiv = $("<div/>").appendTo(this.documentDiv);
			var tabData = {
				tab: tab,
				tabLink: tabLink,
				tabDiv: tabDiv
			};
			this.tabData.push(tabData);

			$(tabLink).click(function(){
				container.selectTab(tabData);
			});

			$(tabClose).click(function(){
				container.removeTab(tabData);
			});

			var documentDialog = new DocumentDialog(this,document,tabDiv,page,position);
			var padding = parseInt($(this.documentDiv).css("padding-bottom"))+parseInt($(this.documentDiv).css("padding-top"));
			tabDiv.css('height',(this.content.height()-this.tabs.height()-padding)+'px');
			documentDialog.initialize();
			documentDialog.setDocType(type);
			documentDialog.showDocumentType(position);
			this.documentDialogs.push(documentDialog);
			this.selectTab(tabData);
			this.resizeContent();
		};

		/**
		* stops processing of actual shown tab (if ESC in browser)
		*/
		this.stopProcessing = function(){
			var dialog = this.dialog();
			if( dialog != null ){
				dialog.stopProcessing();
			}
		};
		
		/**
		* removes a tab from folder
		*/
		this.removeTab = function(tabData){
			for( var i in this.tabData ){
				if( this.tabData[i] == tabData ){
					$(this.tabData[i].tabDiv).remove();
					$(this.tabData[i].tab).remove();
					this.documents.splice(i,1);
					this.documentDialogs.splice(i,1);
					this.tabData.splice(i,1);
					break;
				}
			}
			if( this.tabData.length > 0 ){
				this.selectTab(this.tabData[0]);
			}
			else {
				this.resize();
			}
		};
		
		/**
		* returns selected tab (for magnetic link)
		*/
		this.getSelectedTab = function(){
			return this.selection;
		};
		
		/**
		* sets selected tab (for magnetic link)
		*/
		this.setSelectedTab = function(index){
			this.selectTab(index);
		};
		
};
