ContentWindow = function(){
		
		this.nameId;
		this.index = -1;
		this.documents = [];
		this.documentDialogs = [];
		this.tabData = [];
		this.selection = 0;

		this.setLabel = function(title){
			$(this.label).html(title);
		};

		this.initializeContentWindow = function(index){
			this.index = index;
			this.tabs = $("<ul class='tabs'/>").appendTo(this.content);
			this.documentDiv = $("<div class='inner'/>").appendTo(this.content);
			this.nameId = index;
			this.label = $("<h4/>").appendTo(this.toolbarDiv);
			this.setLabel(this.getName());
		};
		
		this.updateName = function(index){
			if( this.nameId != index ){
				this.nameId = index;
				this.setLabel(this.getName());
			}
		};
		
		this.getName = function(){
			return Util.getString('contentWindow')+" #"+this.nameId;
		};

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

		this.dialog = function(){
			if( this.documentDialogs.length > 0 ){
				return this.documentDialogs[ this.selection ];
			}
			return null;
		};
		
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
				for( var i in this.tabData ){
					$(this.tabData[i].tabDiv).css('display','none');
					$(this.tabData[i].tab).removeClass('selected');
				}
				$(this.tabdata[tab].tabDiv).css('display','block');
				$(this.tabdata[tab].tab).addClass('selected');
			}
		};

		this.addTab = function(document,page,type,position){
			var container = this;
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
		};
				
		this.addDocument = function(document,page,type,position){
			this.documents.push(document);
			this.addTab(document,page,type,position);
			this.resizeContent();
		};

		this.stopProcessing = function(){
			var dialog = this.dialog();
			if( dialog != null ){
				dialog.stopProcessing();
			}
		};
		
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
		
		this.getSelectedTab = function(){
			return this.selection;
		};
		
		this.setSelectedTab = function(index){
			this.selectTab(index);
		};
		
};
