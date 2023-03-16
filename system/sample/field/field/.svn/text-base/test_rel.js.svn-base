var View = Backbone.View.extend({
	relationEvents: {
		'field:readonly:change': function(view, readonly, options){
			console.log('oooo', view.id, readonly, options.reason);
			if(view.id === 'cloffsetitemselector'){
			}
		}
	},
	
	initialize: function(){
		this.relation = clutil.FieldRelation.create('default', {
			clbusunitselector: {
				el: '#ca_unitID'
			},
			cloffsetitemselector: {
				el: '#ca_offsetitemID'
			},
			'cltypeselector equip_typeid': {
				el: '#ca_equipTypeID',
				kind: amcm_type.AMCM_TYPE_EQUIP_TYPE
			},
			clequipcode: {
				el: '#ca_equipID',
				addDepends: ['equip_typeid']
				// dependSrc: {
				// 	equip_typeid: 'xxx'
				// }
			}
		}, {
			dataSource: {
				offsetTypeID: amcm_type.AMCM_VAL_OFFSET_TYPE_FIXED,
				equip_man_typeid: 1
			}
		});
		this.listenTo(this.relation, this.relationEvents);
	}
});

var view;
function main(){
	view = new View({el: 'body'});
	view.render();
}

$(function () {
	clutil.getIniJSON().done(main);
});

