function TableGui(table,div){

    	this.tableContainer = div;
	if( STIStatic.tableWidth ){
		this.tableContainer.style.width = STIStatic.tableWidth;
        }
        if( STIStatic.tableHeight ){
        	this.tableContainer.style.height = STIStatic.tableHeight;
        }

};
