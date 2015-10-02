angular.module('starter.services', ['wSQL'])

.factory('User', function(wSQL,$q) {

    /*wSQL.drop_table("course");
    wSQL.drop_table("courses");
    wSQL.drop_table("cursos");
    wSQL.drop_table("sql_sequence");
    wSQL.drop_table("user");*/


  return {
    saveUser: function(userObj) {
    	var defer = $q.defer();

    	wSQL.delete("user")
        .query()
        .then(function(data){
        	/** Insert new user */
            wSQL.insert("user",userObj).then(function(result){
		        defer.resolve(result);
		    });
        });

	    return defer.promise;
    },

    /** Get current user */
    getUser:function() {
        var defer = $q.defer();

        wSQL.select()
        .from("user")
        .where("iduser",1)
        .row()
        .then(function(d){
           if(angular.isObject(d)) {
                defer.resolve(d[0]);
           } else {
                defer.reject(d);
           }
           
        });

        return defer.promise;
    },

    removeUser:function() {
        var defer = $q.defer();
        wSQL.drop_table("periodos");
        wSQL.drop_table("materias");
        wSQL.drop_table("cursos");
        wSQL.drop_table("user");
        defer.resolve(true);
        return defer.promise;
    }
  };
})

.factory('Cursos', function(wSQL,$q) {
    /*wSQL.drop_table("materias");
    wSQL.drop_table("periodos");*/
    return {

        /** Retorna todos os cursos atuais */
        all: function() {
            var defer = $q.defer();
            wSQL.select()
            .from("cursos")
            .query()
            .then(function(d){
                console.log(d);
                defer.resolve(d);
            });
            return defer.promise;
        },

        getById:function(id) {
            var defer = $q.defer();

            wSQL.select()
            .from("cursos")
            .where("id",id)
            .row()
            .then(function(d){
               if(angular.isObject(d)) {
                    defer.resolve(d[0]);
               } else {
                    defer.reject(d);
               }
            });

            return defer.promise;
        },

        /** Adicionar novo curso */
        addCurso:function(newCurso) {
            var defer = $q.defer();
            wSQL.insert("cursos",newCurso)
            .then(function(insert){
                defer.resolve(insert);
            });
            return defer.promise;
        },
        /** Remove um curso */
        deleteItem:function(item) {
            var defer = $q.defer();
            wSQL.delete("cursos")
            .where("id",item.id)
            .query()
            .then(function(data){
                defer.resolve(data);
            });

            return defer.promise;
        },
    };
})

.factory('Materias',function (Periodos,wSQL,$q) {
    
    

    return {
        all:function(idcurso) {
            var defer = $q.defer();
            wSQL.select("materias.*,cursos.periodo,SUM(periodos.nota) AS total_nota,COUNT(periodos.id) AS total_periodo")
            .from("materias")
            .join("cursos","materias.idcurso","cursos.id","=")
            .left_join("periodos","materias.id","periodos.idmateria","=")
            .where("idcurso",idcurso)
            .group_by("materias.id")
            .query()
            .then(function(results){
                console.debug(results);
                var materias = [];
                angular.forEach(results, function(value, key) {
                    var materia = value;
                    materia["periodos"] = [];
                    materias[key] = materia;
                    var media = 0;
                    Periodos.getNotasByMateria(value.id).then(function(periodos) {
                      materia["periodos"] = periodos;
                    });

                    materia["media"] = 0;
                    //materias.push(materia);
                  });

                defer.resolve(materias);
            });
            
            return defer.promise;
        },
        /** Adicionar nova materia */
        addMateria:function(newMateria,periodo) {
            var defer = $q.defer();
            wSQL.insert("materias",newMateria)
            .then(function(insert){
                /** 
                 * Cadastra os periodos para a materia
                 */
                var totalPeriodos = 0;
                if(periodo=="trimestral") {
                    totalPeriodos = 3;
                } else if(periodo=="bimestral") {
                    totalPeriodos = 4;
                } else {
                    totalPeriodos = 2;
                }

                for(var p = 1;p<=totalPeriodos;p++) {
                    var nPeriodo = {
                        'idmateria':insert.insertId,
                        'nome':'Periodo '+p,
                        'nota':0
                    };

                    wSQL.insert("periodos",nPeriodo);
                }

                defer.resolve(insert);
            });
            return defer.promise;
        },

        deleteItem:function(materia) {
            var defer = $q.defer();

            var idmateria = materia.id;

            wSQL.delete("materias")
            .where("id",idmateria)
            .query()
            .then(function(data){
                wSQL.delete("periodos")
                .where("idmateria",idmateria)
                .query();

                defer.resolve(true);
            });

            return defer.promise;
        }
    };
})


.factory('Periodos',function (wSQL,$q) {
    
    return {
        getNotasByMateria:function(idmateria) {
            var defer = $q.defer();
            wSQL.select()
            .from("periodos")
            .where("idmateria",idmateria)
            .query().then(function(response) {
                defer.resolve(response);
            });
            
            return defer.promise;
        },
        alterarNota:function(idnota,nota) {
            var defer = $q.defer();
            wSQL.update("periodos", {nota:nota})
            .where("id",idnota)
            .query()
            .then(function(result){
                defer.resolve(result);
            });

            return defer.promise;
        }
    };
});

