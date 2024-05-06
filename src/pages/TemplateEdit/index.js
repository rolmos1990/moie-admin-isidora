import React, {useEffect, useRef, useState} from "react"
import {CardBody, Col, Container, Label, Row} from "reactstrap"
import {AvForm} from "availity-reactstrap-validation"
import {Card} from "@material-ui/core";
import {withRouter} from "react-router-dom"
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {getTemplate, registersTemplate, updateTemplate} from "../../store/template/actions";
import {FieldSwitch, FieldText} from "../../components/Fields";
import Breadcrumb from "../../components/Common/Breadcrumb";
import {GROUPS, STATUS} from "../../common/constants";
import ButtonSubmit from "../../components/Common/ButtonSubmit";
import useHookValue from "../../components/mentions/useHookValue";
import MultiMention from "../../components/mentions/MultiMention";
import {getFieldOptionByGroups} from "../../store/fieldOptions/actions";
import {Editor} from '@tinymce/tinymce-react';
import {PERMISSIONS} from "../../helpers/security_rol";
import NoAccess from "../../components/Common/NoAccess";
import HasPermissions from "../../components/HasPermissions";


const TemplateEdit = (props) => {
    const {onGetTemplate, template, onGetMentions, mentions} = props;
    const [templateData, setTemplateData] = useState({_status: STATUS.ACTIVE});
    const [dataMentions, setDataMentions] = useState([]);
    const isEdit = props.match.params.id;
    const [sourceValue, onSourceChange, onSourceAdd, setSourceValue] = useHookValue('');

    const editorRef = useRef(null);

    //carga inicial
    useEffect(() => {
        if (isEdit && onGetTemplate) {
            onGetTemplate(props.match.params.id);
            onGetMentions();
        }
    }, [onGetTemplate]);

    //cargar la información de plantilla
    useEffect(() => {
        if (template.id && isEdit) {
            setTemplateData({...template, _status: template.status});
            setSourceValue(template.template);
        }
    }, [template]);

    useEffect(() => {
        if (mentions && mentions.length > 0) {
            setDataMentions(mentions.map(m => ({id: '{{' + m.value + '}}', display: m.value,})))
        }
    }, [mentions]);

    const handleValidSubmit = (event, values) => {
        const data = Object.assign({}, values, {status: values._status, template: sourceValue});
        delete data._status;

        if (!isEdit) {
            props.onRegistersTemplate(data, props.history)
        } else {
            props.onUpdateTemplate(props.match.params.id, data, props.history)
        }
    }
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb hasBack path="/templates" title={templateData.reference} item={"Plantilla"}/>

                    <HasPermissions permissions={[PERMISSIONS.TEMPLATE_CREATE, PERMISSIONS.TEMPLATE_EDIT]} renderNoAccess={() => <NoAccess/>}>
                        <AvForm className="needs-validation" autoComplete="off"
                                onValidSubmit={(e, v) => {
                                    handleValidSubmit(e, v)
                                }}>
                            <Row>
                                <Col xl="12">
                                    <Card>
                                        <CardBody>
                                            <div className={"mt-1 mb-5"} style={{position: "relative"}}>
                                                <div className={"float-end"}>
                                                    <Row>
                                                        <Col>
                                                            ¿Activo?
                                                        </Col>
                                                        <Col>
                                                            <FieldSwitch defaultValue={templateData._status} name={"_status"}/>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                            <Row>
                                                <Col md="12">
                                                    <div className="mb-3">
                                                        <Label htmlFor="field_name">Referencia <span className="text-danger">*</span></Label>
                                                        <FieldText
                                                            id={"field_reference"}
                                                            name={"reference"}
                                                            value={templateData.reference}
                                                            minLength={3}
                                                            maxLength={255}
                                                            required
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="12">
                                                    <div className="mb-3">
                                                        <Label htmlFor="field_name">Descripción <span className="text-danger">*</span></Label>
                                                        <FieldText
                                                            id={"field_description"}
                                                            name={"description"}
                                                            value={templateData.description}
                                                            required
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                            {!templateData.hasEditor ? (
                                                    <Row>
                                                        <Col md="12">
                                                            <div className="mb-3">
                                                                <Label htmlFor="field_name">Contenido <span
                                                                    className="text-danger">*</span></Label>
                                                                <MultiMention
                                                                    value={sourceValue}
                                                                    data={dataMentions}
                                                                    onChange={onSourceChange}
                                                                    onAdd={onSourceAdd}
                                                                />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                ) :
                                                <Row>
                                                    <Editor
                                                        onInit={(evt, editor) => editorRef.current = editor}
                                                        initialValue={sourceValue}
                                                        onBlur={newContent => setSourceValue(newContent) && onSourceChange}
                                                        init={{
                                                            height: 500,
                                                            menubar: false,
                                                            plugins: "code",
                                                            toolbar: 'undo redo | formatselect | code |',
                                                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                                            apply_source_formatting: true,
                                                            cleanup: false,
                                                            cleanup_on_startup: false
                                                        }}
                                                    />
                                                </Row>
                                            }
                                            <Row>
                                                <Col md={12} className="text-right">
                                                    <ButtonSubmit loading={props.loading}/>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </AvForm>
                    </HasPermissions>
                </Container>
            </div>
        </React.Fragment>
    )
}

const mapTemplateToProps = state => {
    const {error, loading, template} = state.Template
    const {fieldOptions} = state.FieldOption
    return {error, template, loading, mentions: fieldOptions}
}

const mapDispatchToProps = dispatch => ({
    onRegistersTemplate: (data, history) => dispatch(registersTemplate(data, history)),
    onUpdateTemplate: (id, data, history) => dispatch(updateTemplate(id, data, history)),
    onGetTemplate: (id) => dispatch(getTemplate(id)),
    onGetMentions: (conditional = null, limit = 100, page) => dispatch(getFieldOptionByGroups([GROUPS.TEMPLATE_MENTIONS], limit, page)),
})

export default withRouter(connect(mapTemplateToProps, mapDispatchToProps)(TemplateEdit))

TemplateEdit.propTypes = {
    error: PropTypes.any,
    history: PropTypes.object
}

