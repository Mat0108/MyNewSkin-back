module.exports = () => {
    /**
     * @swagger
     * 
     *  components:
     *      schema:
     *          error:
     *              message:
     *                  type:string
     *          blog:
     *              type: object
     *              properties: 
     *                  title:
     *                      type: string
     *                  imagepresentation:
     *                      type: string
     *                  altimagepresentation:
     *                      type: string
     *                  textpresentation:
     *                      type: string
     *                  titlelist:
     *                      type: array
     *                      items:
     *                          type: string
     *                  textlist:
     *                      type: array
     *                      items:
     *                          type: string
     *                  imagelist:
     *                      type: array
     *                      items:
     *                          type: string
     *                  altimage:
     *                      type: array
     *                      items:
     *                          type: string
     *                  textcolor:
     *                      type: array
     *                      items:
     *                          type: string
     *                  layout:
     *                      type: array
     *                      items:
     *                          type: string
     *                  margin:
     *                      type: string
     *
     *          form:
     *              type: object
     *              properties: 
     *                  mail:
     *                      type: string
     *                  date:
     *                      type: date
     *                  question1:
     *                      type: array
     *                      items:
     *                          type: number
     *                  question2:
     *                      type: array
     *                      items:
     *                          type: number
     *                  question3:
     *                      type: array
     *                      items:
     *                          type: number
     *                  question4:
     *                      type: array
     *                      items:
     *                          type: number
     *                  question5:
     *                      type: array
     *                      items:
     *                          type: number
     *          rdv:
     *              type: object
     *              properties: 
     *                  DateDebut:
     *                      type: date
     *                  DateFin:
     *                      type: date
     *                  Confirmation:
     *                      type: boolean
     *                  Type:
     *                      type: boolean
     *                  CompteClient:
     *                      type: objectid
     *                  CompteExpert:
     *                      type: objectid
     *                  Observation:
     *                      type: string
     *          rdvcreation:
     *              type: object
     *              properties: 
     *                  DateDebut:
     *                      type: date
     *                  Type:
     *                      type: boolean
     *                  CompteClient:
     *                      type: string
     *                  CompteExpert:
     *                      type: string
     *          usercreation:
     *              type: object
     *              properties: 
     *                  firstname:
     *                      type: string
     *                  lastname:
     *                      type: string
     *                  email:
     *                      type: string
     *                  password:
     *                      type: string
     *                  type:
     *                      type: number
     *                  imageBase64:
     *                      type: string
     *                  adresse:
     *                      type: string
     *                  ville:
     *                      type: string
     *                  codepostal:
     *                      type: string
     *                  telephone:
     *                      type: string
     *                  showDermatologue:
     *                      type: boolean
     *                  allergiestype:
     *                      type: boolean
     *                  allergies:
     *                      type: string
     *                  sexe:
     *                      type: string
     * 
     */
}
