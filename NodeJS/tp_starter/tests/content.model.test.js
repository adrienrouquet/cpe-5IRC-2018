describe('Test de content.model', () => {

    const CONFIG = require('../config');
    CONFIG.contentDirectory = `${CONFIG.contentDirectory}_test_${Date.now()}`;
    process.env.CONFIG = JSON.stringify(CONFIG);

    const assert = require('assert');
    const fs = require('fs');
    const _p = require('util').promisify;
    const utils = require("../app/utils/utils.js");
    const ContentModel = require("../app/models/content.model.js");

    let content;

    before(`Creation du repertoire ${CONFIG.contentDirectory}`, () => {
        content = new ContentModel({});
        content.id = utils.generateUUID();
        content.type = 'img';
        content.title = 'This is a test';
        content.fileName = content.id + ".txt";
        content.setData("It Works !");

        return _p(fs.mkdir)(CONFIG.contentDirectory);
    });

    // beforeEach('', () => {
    //     console.dir(content);
    // });

    describe('Tests des cas OK', () => {
        describe('TEST CONSTRUCTOR', () => {

            it(`should create a new ContentModel (empty constructor)`, () => {
                return new Promise((resolve, reject) => {

                    let c = new ContentModel();

                    assert.ok(c instanceof ContentModel);
                    assert.equal(c.id, null);
                    assert.equal(c.fileName, null);
                    assert.equal(c.src, null);
                    assert.equal(c.title, null);
                    assert.equal(c.type, null);

                    assert.equal(c.data, undefined);
                    assert.ok(typeof c.getData === 'function');
                    assert.ok(typeof c.setData === 'function');

                    resolve();
                });
            });

            it(`should create a new ContentModel from JSON object`, () => {
                return new Promise((resolve, reject) => {

                    let c = new ContentModel(JSON.parse(JSON.stringify(content)));
                    assert.ok(c instanceof ContentModel);

                    assert.equal(c.id, content.id);
                    assert.equal(c.fileName, content.fileName);
                    assert.equal(c.src, content.src);
                    assert.equal(c.title, content.title);
                    assert.equal(c.type, content.type);

                    assert.notEqual(c.getData(), content.getData());

                    assert.equal(c.data, undefined);
                    assert.ok(typeof c.getData === 'function');
                    assert.ok(typeof c.setData === 'function');

                    c.setData(content.getData());
                    assert.ok(c.getData().length > 0);
                    assert.equal(c.getData(), content.getData());

                    resolve();
                });
            });
        });

        describe('TEST CREATE', () => {

            it(`should create 2 files in ${CONFIG.contentDirectory}`, () => {
                return new Promise((resolve, reject) => {

                    ContentModel.create(content, (err) => {
                        assert.ifError(err);

                        _p(fs.readdir)(CONFIG.contentDirectory)
                            .then(files => {
                                assert.equal(files.length, 2, 'Les fichiers data et meta-data ne sont pas crees correctement');

                                return _p(fs.readFile)(utils.getDataFilePath(content.fileName));
                            })
                            .then(data => {
                                assert.equal(data.toString(), content.getData());

                                resolve();
                            })
                            .catch(reject);
                    });
                });
            });
        });

        describe('TEST READ', () => {
            it(`should return content`, () => {
                return new Promise((resolve, reject) => {

                    ContentModel.read(content.id, (err, data) => {
                        assert.ifError(err);

                        assert.ok(data instanceof ContentModel);
                        assert.equal(JSON.stringify(data), JSON.stringify(content));

                        resolve();
                    });
                });
            });
        });

        describe('TEST UPDATE', () => {
            it(`should update content`, () => {
                content.title = 'Test de la mise a jour...';
                content.setData(content.getData() + ' (UPDATED)');

                return new Promise((resolve, reject) => {

                    ContentModel.update(content, (err, data) => {
                        assert.ifError(err);

                        ContentModel.read(content.id, (err, data) => {
                            assert.ifError(err);

                            assert.ok(data instanceof ContentModel);
                            assert.equal(JSON.stringify(data), JSON.stringify(content));

                            _p(fs.readFile)(utils.getDataFilePath(content.fileName))
                                .then(data => {
                                    assert.equal(data.toString(), content.getData());

                                    resolve();
                                })
                                .catch(reject);
                        });
                    });
                });
            });
        });

        describe('TEST DELETE', () => {
            it(`should delete content`, () => {
                return new Promise((resolve, reject) => {

                    ContentModel.delete(content.id, (err, data) => {
                        assert.ifError(err);

                        _p(fs.readdir)(CONFIG.contentDirectory)
                            .then(files => {
                                assert.equal(files.length, 0, 'Les fichiers data et meta-data ne sont pas supprimes correctement');

                                resolve();
                            })
                            .catch(reject);
                    });
                });
            });
        });
    });

    describe('Tests des cas KO - Gestion des erreurs', () => {

        describe('TEST CREATE', () => {
            it('should failed if param is null', () => {
                return new Promise((resolve, reject) => {

                    ContentModel.create(null, (err, data) => {
                        assert.throws(() => assert.ifError(err), 'La fonction create doit echouer si le parametre d\'entre est null');
                        resolve();
                    });
                });
            });

            it('should failed if param is not an instance of ContentModel', () => {
                return new Promise((resolve, reject) => {
                    ContentModel.create(12, (err, data) => {
                        assert.throws(() => assert.ifError(err), 'La fonction create doit echouer si le parametre d\'entre n\'est pas du type ContentModel');
                        resolve();
                    });
                });
            });

            it('should failed if param is not an instance of ContentModel', () => {
                return new Promise((resolve, reject) => {
                    ContentModel.create({id: 12}, (err, data) => {
                        assert.throws(() => assert.ifError(err), 'La fonction create doit echouer si le parametre d\'entre n\'est pas du type ContentModel');
                        resolve();
                    });
                });
            });

            it('should failed if id is null', () => {
                return new Promise((resolve, reject) => {
                    delete content.id;
                    ContentModel.create(content, (err, data) => {
                        assert.throws(() => assert.ifError(err), 'La fonction create doit echouer si le parametre l\'id est null');
                        resolve();
                    });
                });
            });
        });

        describe('TEST READ', () => {
            it('should failed if id is null', () => {
                return new Promise((resolve, reject) => {

                    ContentModel.read(null, (err, data) => {
                        assert.throws(() => assert.ifError(err), 'La fonction create read echouer si l\'id en parametre est null');
                        resolve();
                    });
                });
            });
            it('should failed if file does not exist', () => {
                return new Promise((resolve, reject) => {
                    ContentModel.read(12, (err, data) => {
                        assert.throws(() => assert.ifError(err), 'La fonction read doit echouer si le fichier n\'existe pas');
                        resolve();
                    });
                });
            });
        });

        describe('TEST UPDATE', () => {
            it('should failed if param is null', () => {
                return new Promise((resolve, reject) => {
                    ContentModel.update(null, (err, data) => {
                        assert.throws(() => assert.ifError(err), 'La fonction update doit echouer si le parametre en entree est null');
                        resolve();
                    });
                });
            });
            it('should failed if id is null', () => {
                return new Promise((resolve, reject) => {
                    delete content.id;
                    ContentModel.update(content, (err, data) => {
                        assert.throws(() => assert.ifError(err), 'La fonction update doit echouer si le fichier n\'existe pas');
                        resolve();
                    });
                });
            });
            it('should failed if file does not exist', () => {
                return new Promise((resolve, reject) => {
                    content.id = utils.generateUUID();
                    ContentModel.update(content, (err, data) => {
                        assert.throws(() => assert.ifError(err), 'La fonction update doit echouer si le fichier n\'existe pas');
                        resolve();
                    });
                });
            });
        });

        describe('TEST DELETE', () => {
            it('should failed if param is null', () => {
                return new Promise((resolve, reject) => {
                    ContentModel.delete(null, (err, data) => {
                        assert.throws(() => assert.ifError(err), 'La fonction delete doit echouer si le parametre en entree est null');
                        resolve();
                    });
                });
            });
            it('should failed if file does not exist', () => {
                return new Promise((resolve, reject) => {
                    content.id = utils.generateUUID();
                    ContentModel.delete(content, (err, data) => {
                        assert.throws(() => assert.ifError(err), 'La fonction delete doit echouer si le fichier n\'existe pas');
                        resolve();
                    });
                });
            });
        });
    });

    after(`Suppression du repertoire ${CONFIG.contentDirectory} s'il est vide`, () => {
        _p(fs.readdir)(CONFIG.contentDirectory)
            .then(files => {
                if (files.length > 0) {
                    return assert.ok(false, `Le répertoire ${CONFIG.contentDirectory} utilisé pour les tests n'est pas vide.`);
                }

                return _p(fs.rmdir)(CONFIG.contentDirectory);
            })
            .catch(err => {
                console.error(err);
            });
    });
});